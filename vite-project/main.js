const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let terminals = {};

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173"); // Or index.html for build
}

ipcMain.on("run-command", (event, { shell, command }) => {
  if (!terminals[shell]) {
    let shellCmd;
    switch (shell) {
      case "cmd": shellCmd = "cmd.exe"; break;
      case "powershell": shellCmd = "powershell.exe"; break;
      case "bash": shellCmd = "bash"; break;
      case "ubuntu": shellCmd = "wsl"; break;
    }

    const proc = spawn(shellCmd, [], { stdio: "pipe" });
    proc.stdout.on("data", (data) => {
      mainWindow.webContents.send("terminal-output", data.toString());
    });
    proc.stderr.on("data", (data) => {
      mainWindow.webContents.send("terminal-output", data.toString());
    });
    terminals[shell] = proc;
  }

  terminals[shell].stdin.write(command + "\n");
});

app.on("ready", createWindow);
