// main.js
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const pty = require('@lydell/node-pty');

let ptyProcesses = {};

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: Math.floor(width * 0.85),  // 85% of screen width
    height: Math.floor(height * 0.85), // 85% of screen height
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('pty-spawn', (event, shell, cols, rows) => {
  const term = pty.spawn(shell, [], { cols, rows, cwd: process.cwd(), env: process.env });
  const id = Date.now();
  ptyProcesses[id] = term;

  term.onData(data => event.sender.send('pty-data', { id, data }));

  return id;
});

ipcMain.on('pty-input', (event, id, data) => {
  if (ptyProcesses[id]) {
    ptyProcesses[id].write(data);
  }
});
