use notify::{RecommendedWatcher, RecursiveMode, Result as NotifyResult, Watcher, Event};
use std::sync::{Arc, Mutex};
use std::path::{Path, PathBuf};
use std::thread;
use std::time::Duration;
use std::fs;
use std::sync::mpsc::{channel, Sender, Receiver};

pub struct SyncManager {
    watcher: Option<RecommendedWatcher>,
    watch_path: PathBuf,
    sync_target_path: PathBuf,
    running: Arc<Mutex<bool>>,
}

impl SyncManager {
    pub fn new(watch_path: impl AsRef<Path>, sync_target_path: impl AsRef<Path>) -> Self {
        Self {
            watcher: None,
            watch_path: watch_path.as_ref().to_path_buf(),
            sync_target_path: sync_target_path.as_ref().to_path_buf(),
            running: Arc::new(Mutex::new(false)),
        }
    }

    pub fn start_sync(&mut self) -> NotifyResult<()> {
        let (tx, rx): (Sender<Event>, Receiver<Event>) = channel();
        let watch_path = self.watch_path.clone();
        let sync_target_path = self.sync_target_path.clone();
        let running = self.running.clone();

        // Mark running true
        {
            let mut r = running.lock().unwrap();
            *r = true;
        }

        // Create watcher
        let mut watcher: RecommendedWatcher = Watcher::new_immediate(move |res| {
            if let Ok(event) = res {
                tx.send(event).unwrap();
            }
        })?;

        watcher.watch(&watch_path, RecursiveMode::Recursive)?;

        self.watcher = Some(watcher);

        // Spawn thread to handle events
        thread::spawn(move || {
            while *running.lock().unwrap() {
                if let Ok(event) = rx.recv_timeout(Duration::from_secs(1)) {
                    // For simplicity, sync any created or modified files
                    for path in event.paths {
                        if path.is_file() {
                            if let Err(e) = SyncManager::sync_file(&path, &sync_target_path) {
                                eprintln!("Sync error: {}", e);
                            }
                        }
                    }
                }
            }
            println!("Sync thread stopped");
        });

        Ok(())
    }

    pub fn stop_sync(&mut self) {
        let mut r = self.running.lock().unwrap();
        *r = false;
        self.watcher = None; // drop watcher to stop watching
    }

    fn sync_file(file_path: &Path, target_dir: &Path) -> std::io::Result<()> {
        if !target_dir.exists() {
            fs::create_dir_all(target_dir)?;
        }
        let file_name = file_path.file_name().ok_or_else(|| {
            std::io::Error::new(std::io::ErrorKind::Other, "Invalid file name")
        })?;
        let target_path = target_dir.join(file_name);

        fs::copy(file_path, target_path)?;
        println!("Synced file: {:?}", file_path);
        Ok(())
    }
}
