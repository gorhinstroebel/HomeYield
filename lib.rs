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
    let connection =
        Connection::open(database_path(app)?).map_err(|error| format!("Could not open SQLite: {error}"))?;
    connection
        .execute_batch(
            "PRAGMA journal_mode = WAL;
             CREATE TABLE IF NOT EXISTS garden_state (
                 id INTEGER PRIMARY KEY CHECK (id = 1),
                 state_json TEXT NOT NULL,
                 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
             );",
        )
        .map_err(|error| format!("Could not initialize SQLite: {error}"))?;
    Ok(connection)
}

#[tauri::command]
fn load_state(app: AppHandle) -> Result<Option<String>, String> {
    let connection = open_database(&app)?;
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
    if state_json.len() > MAX_STATE_BYTES {
        return Err("State payload is too large".to_string());
    }
    let parsed: serde_json::Value =
        serde_json::from_str(&state_json).map_err(|error| format!("Invalid state JSON: {error}"))?;
    if !parsed.is_object() {
        return Err("State must be a JSON object".to_string());
    }

    let connection = open_database(&app)?;
    connection
        .execute(
            "INSERT INTO garden_state (id, state_json) VALUES (1, ?1)
             ON CONFLICT(id) DO UPDATE SET state_json = excluded.state_json, updated_at = CURRENT_TIMESTAMP",
            params![state_json],
        )
        .map_err(|error| format!("Could not save SQLite state: {error}"))?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![load_state, save_state])
        .run(tauri::generate_context!())
        .expect("error while running HomeYield");
}
