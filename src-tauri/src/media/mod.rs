use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use std::ffi::OsStr;
use std::fs::File;
use std::io::Write;
use std::time::{SystemTime, UNIX_EPOCH};

/// Represents metadata about a saved media file
#[derive(Debug, Clone)]
pub struct MediaFile {
    pub filename: String,
    pub filepath: PathBuf,
    pub filesize: u64,
    pub media_type: String, // e.g., "image/png", "video/mp4"
}

/// Save media bytes to disk with a unique filename inside `media_dir`.
/// Returns MediaFile metadata on success.
pub fn save_media_file(
    media_dir: &Path,
    media_bytes: &[u8],
    original_filename: &str,
    media_type: &str,
) -> io::Result<MediaFile> {
    // Ensure media directory exists
    fs::create_dir_all(media_dir)?;

    // Generate unique filename (e.g., timestamp + original extension)
    let extension = Path::new(original_filename)
        .extension()
        .and_then(OsStr::to_str)
        .unwrap_or("dat");

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis();

    let unique_filename = format!("{}_{}.{}", timestamp, uuid::Uuid::new_v4(), extension);

    let filepath = media_dir.join(&unique_filename);

    // Write bytes to file
    let mut file = File::create(&filepath)?;
    file.write_all(media_bytes)?;

    let filesize = fs::metadata(&filepath)?.len();

    Ok(MediaFile {
        filename: unique_filename,
        filepath,
        filesize,
        media_type: media_type.to_string(),
    })
}

/// Delete a media file given its path
pub fn delete_media_file(filepath: &Path) -> io::Result<()> {
    if filepath.exists() {
        fs::remove_file(filepath)?;
    }
    Ok(())
}

/// Load media file metadata for a given file path
pub fn load_media_file_metadata(filepath: &Path) -> io::Result<MediaFile> {
    if !filepath.exists() {
        return Err(io::Error::new(io::ErrorKind::NotFound, "File not found"));
    }

    let filename = filepath
        .file_name()
        .and_then(OsStr::to_str)
        .unwrap_or("")
        .to_string();

    let filesize = fs::metadata(filepath)?.len();

    // Simple guess for media type by extension (expandable)
    let media_type = match filepath.extension().and_then(OsStr::to_str) {
        Some("png") => "image/png",
        Some("jpg") | Some("jpeg") => "image/jpeg",
        Some("gif") => "image/gif",
        Some("mp4") => "video/mp4",
        Some("mp3") => "audio/mpeg",
        Some("wav") => "audio/wav",
        _ => "application/octet-stream",
    }
    .to_string();

    Ok(MediaFile {
        filename,
        filepath: filepath.to_path_buf(),
        filesize,
        media_type,
    })
}
