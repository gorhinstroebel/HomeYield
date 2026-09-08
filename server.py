"""Local HomeYield server with SQLite-backed garden state."""

from __future__ import annotations

import json
import os
import sqlite3
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DATABASE_PATH = ROOT / "data" / "homeyield.sqlite3"
MAX_STATE_BYTES = 3 * 1024 * 1024


def database() -> sqlite3.Connection:
    DATABASE_PATH.parent.mkdir(exist_ok=True)
    connection = sqlite3.connect(DATABASE_PATH)
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS garden_state (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            state_json TEXT NOT NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    return connection


class HomeYieldHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:
        if self.path.split("?")[0] in ("/", "/index.html"):
            content = (ROOT / "index.html").read_text(encoding="utf-8").replace(
                'name="homeyield-storage" content="browser"',
                'name="homeyield-storage" content="sqlite"',
            ).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(content)
            return
        if self.path == "/api/health":
            self.send_json(HTTPStatus.OK, {"ok": True, "service": "homeyield"})
            return
        if self.path == "/api/state":
            with database() as connection:
                row = connection.execute(
                    "SELECT state_json, updated_at FROM garden_state WHERE id = 1"
                ).fetchone()
            self.send_json(
                HTTPStatus.OK,
                {"state": json.loads(row[0]) if row else None, "updatedAt": row[1] if row else None},
            )
            return
        if self.path.startswith("/data/"):
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        super().do_GET()

    def do_PUT(self) -> None:
        if self.path != "/api/state":
            self.send_error(HTTPStatus.NOT_FOUND)
            return

        content_length = self.headers.get("Content-Length")
        if content_length is None:
            self.send_error(HTTPStatus.LENGTH_REQUIRED, "Content-Length is required")
            return

        try:
            length = int(content_length)
        except ValueError:
            self.send_error(HTTPStatus.BAD_REQUEST, "Invalid Content-Length")
            return

        if length < 1 or length > MAX_STATE_BYTES:
            self.send_error(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, "State payload is too large")
            return

        try:
            payload = json.loads(self.rfile.read(length))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_error(HTTPStatus.BAD_REQUEST, "State must be valid JSON")
            return

        if not isinstance(payload, dict) or not isinstance(payload.get("state"), dict):
            self.send_error(HTTPStatus.BAD_REQUEST, "A state object is required")
            return

        state_json = json.dumps(payload["state"], separators=(",", ":"))
        with database() as connection:
            connection.execute(
                """
                INSERT INTO garden_state (id, state_json, updated_at)
                VALUES (1, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(id) DO UPDATE SET
                    state_json = excluded.state_json,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (state_json,),
            )
        self.send_json(HTTPStatus.OK, {"saved": True})

    def send_json(self, status: HTTPStatus, payload: dict) -> None:
        content = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(content)

    def end_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)")
        self.send_header(
            "Content-Security-Policy",
            "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; "
            "connect-src 'self' https://api.github.com https://api.open-meteo.com https://geocoding-api.open-meteo.com "
            "https://nominatim.openstreetmap.org; img-src 'self' data: blob:; "
            "style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; worker-src 'self'",
        )
        super().end_headers()


if __name__ == "__main__":
    database().close()
    class ReusableThreadingHTTPServer(ThreadingHTTPServer):
        allow_reuse_address = True

    port = int(os.environ.get("PORT", "4173"))
    ReusableThreadingHTTPServer(("127.0.0.1", port), HomeYieldHandler).serve_forever()
