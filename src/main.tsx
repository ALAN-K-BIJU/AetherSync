import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'uno.css' // ⬅️ important: enables UnoCSS styles globally


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
