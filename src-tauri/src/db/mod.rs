use rusqlite::{params, Connection, Result as SqlResult};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Memory {
    pub id: String,
    pub title: String,
    pub tags: String,
    pub created_at: String,
    pub media_type: String,
    pub filename: String,
}

 pub fn get_connection() -> SqlResult<Connection> {
    Connection::open("aethersync.db")
}

pub fn init_db() -> Result<(), String> {
    let conn = get_connection().map_err(|e| e.to_string())?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS memories (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            tags TEXT,
            created_at TEXT NOT NULL,
            media_type TEXT NOT NULL,
            filename TEXT NOT NULL
        )",
        [],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

pub fn get_all_memories() -> Result<Vec<Memory>, String> {
    let conn = get_connection().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, title, tags, created_at, media_type, filename FROM memories")
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(Memory {
                id: row.get(0)?,
                title: row.get(1)?,
                tags: row.get(2)?,
                created_at: row.get(3)?,
                media_type: row.get(4)?,
                filename: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let result = rows
        .into_iter()
        .collect::<SqlResult<Vec<Memory>>>()
        .map_err(|e| e.to_string())?;

    Ok(result)
}

pub fn get_memory_by_id(id: String) -> Result<Memory, String> {
    let conn = get_connection().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(
        "SELECT id, title, tags, created_at, media_type, filename FROM memories WHERE id = ?1",
    )
    .map_err(|e| e.to_string())?;

    let memory = stmt
        .query_row(params![id], |row| {
            Ok(Memory {
                id: row.get(0)?,
                title: row.get(1)?,
                tags: row.get(2)?,
                created_at: row.get(3)?,
                media_type: row.get(4)?,
                filename: row.get(5)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(memory)
}

pub fn add_memory(memory: Memory) -> Result<(), String> {
    let conn = get_connection().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO memories (id, title, tags, created_at, media_type, filename) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![
            memory.id,
            memory.title,
            memory.tags,
            memory.created_at,
            memory.media_type,
            memory.filename
        ],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}
