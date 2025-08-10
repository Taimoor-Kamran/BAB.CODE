// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Add a global type for electronAPI so TS knows it exists
declare global {
  interface Window {
    electronAPI?: {
      sendCommand: (data: { shell: string; command: string }) => void;
      onTerminalOutput: (callback: (output: string) => void) => void;
    };
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
