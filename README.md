# 🌌 AetherSync

**AetherSync** is a local-first, end-to-end encrypted media vault designed for families to privately and securely store cherished memories — photos, videos, audio, and journal entries — with optional sync capabilities over IPFS, LAN, or peer-to-peer networks.

> ✨ **Privacy-first. Offline-capable. Yours forever.**

---

## 🔐 Key Features

- 📸 Upload and organize **photos**, **videos**, **voice notes**, and **journal entries**
- 🔐 **End-to-end encryption** (per family, per memory)
- 🧠 **Local-only face clustering** and tagging using on-device ML
- 🎙️ Audio transcription using **Whisper** (runs locally)
- 🗺️ Timeline view, **memory map**, and tag-based filters
- 🔗 Create and share memories via **Capsule Links** with access control
- 🔄 Optional sync via **IPFS**, **LAN peer-to-peer**, or **Syncthing**

---

## 📦 Tech Stack

| Layer       | Tech                                                                 |
|-------------|----------------------------------------------------------------------|
| **Frontend** | Tauri desktop app using **React** (or Svelte)                       |
| **Backend**  | Rust (offline-first focused architecture)               |
| **Storage**  | **SQLite** for metadata, **encrypted local file store**            |
| **Encryption** | **AES-256** / **Libsodium** per-memory keys                     |
| **ML**       | **ONNX/FaceNet** for face clustering, **Whisper** for transcription(under construction 🚧) |
| **Sync**     | Optional: **IPFS**, **Hypercore**, or **Syncthing**                |

---

## 🚧 Project Status

> ⚠️ **AetherSync is currently under active development.**  
> Features, design, and functionality are evolving rapidly. Contributions, feedback, and ideas are welcome!

---

## 🖼️ Screenshots

<div align="center">
  
### 🏠 Home Screen
<img src="https://github.com/ALAN-K-BIJU/AetherSync/blob/main/screenshots/home.jpg" alt="Home Screen" width="600"/>

### 📤 Upload Screen
<img src="https://github.com/ALAN-K-BIJU/AetherSync/blob/main/screenshots/upload.jpg" alt="Upload Screen" width="600"/>

### ⚙️ Settings Screen
<img src="https://github.com/ALAN-K-BIJU/AetherSync/blob/main/screenshots/settings.jpg" alt="Settings Screen" width="600"/>

</div>

---

## 📫 Stay Connected

Have ideas, feature requests, or want to contribute?  
Feel free to fork the repo, create issues, or reach out via [GitHub Issues](https://github.com/ALAN-K-BIJU/AetherSync/issues).

---

> 🛡️ *Because memories deserve more than the cloud.*

