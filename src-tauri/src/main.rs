#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Manager, State};
use serde::{Deserialize, Serialize};
use std::fs;
use rusqlite::{params, Connection};
use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use std::path::PathBuf;
use uuid::Uuid;
use chrono::Utc;
use std::sync::Mutex;

mod commands;
mod db;
mod crypto;
mod media;
mod whisper;
mod sync;

// ----------- Memory structs and commands ------------

#[derive(Deserialize)]
struct MemoryInput {
    title: String,
    tags: String,
    media_data: String,
    filename: String,
    media_type: String,
}

#[derive(Serialize)]
struct Memory {
    id: String,
    title: String,
    tags: String,
    created_at: String,
    media_type: String,
    filename: String,
}

#[tauri::command]
fn add_memory(input: MemoryInput) -> Result<(), String> {
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();
    let media_folder = PathBuf::from("media_store");
    let _ = fs::create_dir_all(&media_folder);

    let media_bytes = STANDARD.decode(&input.media_data).map_err(|e| e.to_string())?;
    let media_path = media_folder.join(&input.filename);
    fs::write(&media_path, &media_bytes).map_err(|e| e.to_string())?;

    let conn = db::get_conn().map_err(|e| e.to_string())?;
    let query = "INSERT INTO memories (id, title, tags, created_at, media_type, filename, key_encrypted, transcription) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)";
    conn.execute(query, [&id, &input.title, &input.tags, &now, &input.media_type, &input.filename, "", ""]).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn list_memories() -> Result<Vec<Memory>, String> {
    let conn = db::get_conn().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, title, tags, created_at, media_type, filename FROM memories").map_err(|e| e.to_string())?;
    let memories = stmt.query_map([], |row| {
        Ok(Memory {
            id: row.get(0)?,
            title: row.get(1)?,
            tags: row.get(2)?,
            created_at: row.get(3)?,
            media_type: row.get(4)?,
            filename: row.get(5)?,
        })
    }).map_err(|e| e.to_string())?.collect::<Result<Vec<_>, _>>().map_err(|e| e.to_string())?;

    Ok(memories)
}

#[tauri::command]
fn get_memory_by_id(id: String) -> Result<Memory, String> {
    let conn = Connection::open("aethersync.db").map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, title, tags, created_at, media_type, filename FROM memories WHERE id = ?1").map_err(|e| e.to_string())?;
    let mut rows = stmt.query(params![id]).map_err(|e| e.to_string())?;

    if let Some(row) = rows.next().map_err(|e| e.to_string())? {
        Ok(Memory {
            id: row.get(0).map_err(|e| e.to_string())?,
            title: row.get(1).map_err(|e| e.to_string())?,
            tags: row.get(2).map_err(|e| e.to_string())?,
            created_at: row.get(3).map_err(|e| e.to_string())?,
            media_type: row.get(4).map_err(|e| e.to_string())?,
            filename: row.get(5).map_err(|e| e.to_string())?,
        })
    } else {
        Err("Memory not found".into())
    }
}

// ----------- Whisper transcription command ------------

#[derive(Deserialize)]
struct TranscriptionInput {
    file_path: String,
    language: Option<String>,
}

#[tauri::command]
async fn transcribe_audio(
    input: TranscriptionInput,
    whisper_client: State<'_, whisper::WhisperClient>,
) -> Result<String, String> {
    whisper_client
        .transcribe_audio(&input.file_path, input.language.as_deref())
        .await
}

// ----------- Sync manager commands ------------

struct SyncState(Mutex<Option<sync::SyncManager>>);

#[tauri::command]
fn start_sync(state: State<'_, SyncState>, watch_path: String, target_path: String) -> Result<(), String> {
    let mut guard = state.0.lock().unwrap();

    if guard.is_some() {
        return Err("Sync already running".into());
    }

    let mut manager = sync::SyncManager::new(watch_path, target_path);
    manager.start_sync().map_err(|e| e.to_string())?;
    *guard = Some(manager);

    Ok(())
}

#[tauri::command]
fn stop_sync(state: State<'_, SyncState>) -> Result<(), String> {
    let mut guard = state.0.lock().unwrap();
    if let Some(manager) = guard.take() {
        manager.stop_sync();
        Ok(())
    } else {
        Err("Sync is not running".into())
    }
}

// ----------- main function ------------

#[tokio::main]
async fn main() {
    // Initialize database
    db::init_db().expect("Failed to initialize DB");

    // Create WhisperClient from environment variable
    let api_key = std::env::var("OPENAI_API_KEY").expect("Missing OPENAI_API_KEY env var");
    let whisper_client = whisper::WhisperClient::new(api_key);

    // Initialize SyncState (not running yet)
    let sync_state = SyncState(Mutex::new(None));

    tauri::Builder::default()
        .manage(whisper_client)
        .manage(sync_state)
        .invoke_handler(tauri::generate_handler![
            add_memory,
            list_memories,
            get_memory_by_id,
            transcribe_audio,
            start_sync,
            stop_sync
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
