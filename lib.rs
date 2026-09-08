use rusqlite::{params, Connection};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

const MAX_STATE_BYTES: usize = 3 * 1024 * 1024;

fn database_path(app: &AppHandle) -> Result<PathBuf, String> {
    let directory = app
        .path()
        .app_local_data_dir()
        .map_err(|error| format!("Could not resolve app data directory: {error}"))?;
    fs::create_dir_all(&directory)
        .map_err(|error| format!("Could not create app data directory: {error}"))?;
    Ok(directory.join("homeyield.sqlite3"))
}

fn open_database(app: &AppHandle) -> Result<Connection, String> {
    let connection = Connection::open(database_path(app)?)
        .map_err(|error| format!("Could not open SQLite: {error}"))?;
    initialize_database(&connection)?;
    Ok(connection)
}

fn initialize_database(connection: &Connection) -> Result<(), String> {
    connection
        .execute_batch(
            "PRAGMA journal_mode = WAL;
             CREATE TABLE IF NOT EXISTS garden_state (
                 id INTEGER PRIMARY KEY CHECK (id = 1),
                 state_json TEXT NOT NULL,
                 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
             );",
        )
        .map_err(|error| format!("Could not initialize SQLite: {error}"))
}

#[tauri::command]
fn load_state(app: AppHandle) -> Result<Option<String>, String> {
    let connection = open_database(&app)?;
    read_state(&connection)
}

fn read_state(connection: &Connection) -> Result<Option<String>, String> {
    connection
        .query_row(
            "SELECT state_json FROM garden_state WHERE id = 1",
            [],
            |row| row.get(0),
        )
        .map(Some)
        .or_else(|error| {
            if matches!(error, rusqlite::Error::QueryReturnedNoRows) {
                Ok(None)
            } else {
                Err(format!("Could not load SQLite state: {error}"))
            }
        })
}

#[tauri::command]
fn save_state(app: AppHandle, state_json: String) -> Result<(), String> {
    validate_state(&state_json)?;
    let connection = open_database(&app)?;
    write_state(&connection, &state_json)
}

fn validate_state(state_json: &str) -> Result<(), String> {
    if state_json.len() > MAX_STATE_BYTES {
        return Err("State payload is too large".to_string());
    }
    let parsed: serde_json::Value =
        serde_json::from_str(state_json).map_err(|error| format!("Invalid state JSON: {error}"))?;
    if !parsed.is_object() {
        return Err("State must be a JSON object".to_string());
    }

    Ok(())
}

fn write_state(connection: &Connection, state_json: &str) -> Result<(), String> {
    connection
        .execute(
            "INSERT INTO garden_state (id, state_json) VALUES (1, ?1)
             ON CONFLICT(id) DO UPDATE SET state_json = excluded.state_json, updated_at = CURRENT_TIMESTAMP",
            params![state_json],
        )
        .map_err(|error| format!("Could not save SQLite state: {error}"))?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sqlite_round_trip_replaces_the_single_garden_record() {
        let connection = Connection::open_in_memory().unwrap();
        initialize_database(&connection).unwrap();
        assert_eq!(read_state(&connection).unwrap(), None);
        for state in [
            r#"{"plants":["tomato"],"logs":[]}"#,
            r#"{"plants":["basil"],"logs":[]}"#,
        ] {
            validate_state(state).unwrap();
            write_state(&connection, state).unwrap();
            assert_eq!(read_state(&connection).unwrap().as_deref(), Some(state));
        }
        let rows: i64 = connection
            .query_row("SELECT COUNT(*) FROM garden_state", [], |row| row.get(0))
            .unwrap();
        assert_eq!(rows, 1);
    }

    #[test]
    fn native_storage_rejects_invalid_or_oversized_state() {
        assert!(validate_state("not JSON")
            .unwrap_err()
            .starts_with("Invalid state JSON"));
        for state in ["[]", "null", "1", "\"text\""] {
            assert_eq!(
                validate_state(state).unwrap_err(),
                "State must be a JSON object"
            );
        }
        assert_eq!(
            validate_state(&" ".repeat(MAX_STATE_BYTES + 1)).unwrap_err(),
            "State payload is too large"
        );
        assert!(validate_state("{}").is_ok());
    }

    #[test]
    fn sqlite_failures_are_reported_not_replaced_with_empty_state() {
        let connection = Connection::open_in_memory().unwrap();
        assert!(read_state(&connection)
            .unwrap_err()
            .starts_with("Could not load SQLite state"));
        assert!(write_state(&connection, "{}")
            .unwrap_err()
            .starts_with("Could not save SQLite state"));
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![load_state, save_state])
        .run(tauri::generate_context!())
        .expect("error while running HomeYield");
}
