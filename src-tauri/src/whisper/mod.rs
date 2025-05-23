use serde::{Deserialize, Serialize};
use reqwest::Client;
use std::path::Path;

const OPENAI_API_URL: &str = "https://api.openai.com/v1/audio/transcriptions";

#[derive(Debug)]
pub struct WhisperClient {
    api_key: String,
    client: Client,
}

#[derive(Debug, Serialize)]
struct TranscriptionRequest<'a> {
    model: &'a str,
    file_path: &'a str,
    language: Option<&'a str>,
}

#[derive(Debug, Deserialize)]
pub struct TranscriptionResponse {
    pub text: String,
}

impl WhisperClient {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            client: Client::new(),
        }
    }

    /// Transcribe the audio file at `file_path` using OpenAI Whisper API.
    pub async fn transcribe_audio(
        &self,
        file_path: &str,
        language: Option<&str>,
    ) -> Result<String, String> {
        if !Path::new(file_path).exists() {
            return Err(format!("File '{}' not found", file_path));
        }

        // Build multipart form
        let part = reqwest::multipart::Part::file(file_path)?;
        let form = reqwest::multipart::Form::new()
            .text("model", "whisper-1")
            .part("file", part)
            .map_err(|e| format!("Failed to create form: {}", e))?;

        let form = if let Some(lang) = language {
            form.text("language", lang)
        } else {
            form
        };

        let res = self
            .client
            .post(OPENAI_API_URL)
            .bearer_auth(&self.api_key)
            .multipart(form)
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !res.status().is_success() {
            let status = res.status();
            let text = res.text().await.unwrap_or_default();
            return Err(format!("OpenAI API error {}: {}", status, text));
        }

        let transcription: TranscriptionResponse = res
            .json()
            .await
            .map_err(|e| format!("Failed to parse response JSON: {}", e))?;

        Ok(transcription.text)
    }
}
