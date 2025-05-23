use aes_gcm::aead::{Aead, KeyInit, OsRng};
use aes_gcm::{Aes256Gcm, Nonce}; // Or `Aes128Gcm`
use aes_gcm::aead::rand_core::RngCore;
use std::fs;
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use base64::{engine::general_purpose, Engine};
use aes::Aes256;
use block_modes::{BlockMode, Cbc};
use block_modes::block_padding::Pkcs7;
use sha2::{Digest, Sha256};
use rand::{RngCore, rngs::OsRng};
use base64::{encode as b64encode, decode as b64decode};

type Aes256Cbc = Cbc<Aes256, Pkcs7>;
const NONCE_SIZE: usize = 12;

/// Encrypts the contents of a file using AES-256-GCM.
/// Returns the encrypted file path or an error.
pub fn encrypt_file(file_path: &str, key: &[u8; 32]) -> Result<String, String> {
    let cipher = Aes256Gcm::new_from_slice(key).map_err(|e| e.to_string())?;

    // Read file content
    let mut file = File::open(file_path).map_err(|e| e.to_string())?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).map_err(|e| e.to_string())?;

    // Generate nonce
    let mut nonce_bytes = [0u8; NONCE_SIZE];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    // Encrypt
    let ciphertext = cipher.encrypt(nonce, buffer.as_ref()).map_err(|e| e.to_string())?;

    // Combine nonce + ciphertext
    let mut encrypted_data = nonce_bytes.to_vec();
    encrypted_data.extend(ciphertext);

    // Write to new file
    let encrypted_path = format!("{}.enc", file_path);
    let mut encrypted_file = File::create(&encrypted_path).map_err(|e| e.to_string())?;
    encrypted_file.write_all(&encrypted_data).map_err(|e| e.to_string())?;

    Ok(encrypted_path)
}

/// Decrypts an encrypted file (must be AES-GCM format with nonce prefix).
/// Returns the decrypted file path or an error.
pub fn decrypt_file(encrypted_path: &str, key: &[u8; 32]) -> Result<String, String> {
    let cipher = Aes256Gcm::new_from_slice(key).map_err(|e| e.to_string())?;

    // Read encrypted file
    let mut file = File::open(encrypted_path).map_err(|e| e.to_string())?;
    let mut encrypted_data = Vec::new();
    file.read_to_end(&mut encrypted_data).map_err(|e| e.to_string())?;

    if encrypted_data.len() < NONCE_SIZE {
        return Err("Invalid encrypted file".into());
    }

    let nonce = Nonce::from_slice(&encrypted_data[..NONCE_SIZE]);
    let ciphertext = &encrypted_data[NONCE_SIZE..];

    // Decrypt
    let plaintext = cipher.decrypt(nonce, ciphertext).map_err(|e| e.to_string())?;

    // Write to new file
    let decrypted_path = encrypted_path.trim_end_matches(".enc").to_string() + ".dec";
    let mut decrypted_file = File::create(&decrypted_path).map_err(|e| e.to_string())?;
    decrypted_file.write_all(&plaintext).map_err(|e| e.to_string())?;

    Ok(decrypted_path)
}

/// Generate a random 256-bit key for AES-GCM encryption (for testing/demo)
pub fn generate_key_base64() -> String {
    let mut key = [0u8; 32];
    OsRng.fill_bytes(&mut key);
    general_purpose::STANDARD.encode(key)
}
fn derive_key(key: &str) -> [u8; 32] {
    let mut hasher = Sha256::new();
    hasher.update(key.as_bytes());
    let result = hasher.finalize();
    let mut key_bytes = [0u8; 32];
    key_bytes.copy_from_slice(&result);
    key_bytes
}

pub fn encrypt_aes(plaintext: &str, key: &str) -> Result<String, String> {
    let key_bytes = derive_key(key);

    let mut iv = [0u8; 16];
    OsRng.fill_bytes(&mut iv);

    let cipher = Aes256Cbc::new_from_slices(&key_bytes, &iv)
        .map_err(|e| format!("Cipher init failed: {:?}", e))?;

    let ciphertext = cipher.encrypt_vec(plaintext.as_bytes());

    let mut combined = Vec::new();
    combined.extend_from_slice(&iv);
    combined.extend_from_slice(&ciphertext);

    Ok(b64encode(&combined))
}

pub fn decrypt_aes(ciphertext_b64: &str, key: &str) -> Result<String, String> {
    let key_bytes = derive_key(key);
    let combined = b64decode(ciphertext_b64)
        .map_err(|e| format!("Base64 decode failed: {:?}", e))?;

    if combined.len() < 16 {
        return Err("Ciphertext too short".into());
    }

    let (iv, ciphertext) = combined.split_at(16);

    let cipher = Aes256Cbc::new_from_slices(&key_bytes, iv)
        .map_err(|e| format!("Cipher init failed: {:?}", e))?;

    let decrypted_bytes = cipher
        .decrypt_vec(ciphertext)
        .map_err(|e| format!("Decryption failed: {:?}", e))?;

    let plaintext = String::from_utf8(decrypted_bytes)
        .map_err(|e| format!("UTF-8 decode failed: {:?}", e))?;

    Ok(plaintext)
}