const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendCommand: (data) => ipcRenderer.send("run-command", data),
  onTerminalOutput: (callback) =>
    ipcRenderer.on("terminal-output", (event, output) => callback(output)),
});
