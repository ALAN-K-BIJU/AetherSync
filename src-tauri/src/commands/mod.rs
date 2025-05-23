use tauri::command;
use crate::db;
use crate::crypto;
use crate::db::Memory;

#[command]
pub fn get_all_memories() -> Result<Vec<Memory>, String> {
    db::get_all_memories()
}


#[command]
pub fn encrypt_text(text: String, key: String) -> Result<String, String> {
    crypto::encrypt_aes(&text, &key)
}

#[command]
pub fn decrypt_text(cipher: String, key: String) -> Result<String, String> {
    crypto::decrypt_aes(&cipher, &key)
}

