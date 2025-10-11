// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getShell: () => {
    if (process.platform === 'win32') return 'powershell.exe';
    return process.env.SHELL || 'bash';
  },

  spawnPty: (shell, cols, rows) => ipcRenderer.invoke('pty-spawn', shell, cols, rows),
  sendInput: (id, data) => ipcRenderer.send('pty-input', id, data),
  onData: (callback) => ipcRenderer.on('pty-data', (event, payload) => callback(payload))
});
