// Terminal setup
const term = new window.Terminal({
  theme: { background: '#000', foreground: '#fff' },
  cursorBlink: true
});
const fitAddon = new window.FitAddon.FitAddon();
term.loadAddon(fitAddon);

const terminalContainer = document.getElementById('terminal');
term.open(terminalContainer);
fitAddon.fit(); // initial fit

// Handle resizing like VS Code
const resizer = document.getElementById('resizer');
let isResizing = false;

resizer.addEventListener('mousedown', () => isResizing = true);
document.addEventListener('mousemove', (e) => {
  if (!isResizing) return;
  const newHeight = window.innerHeight - e.clientY;
  terminalContainer.style.height = newHeight + 'px';
  fitAddon.fit(); // terminal always fits container
});
document.addEventListener('mouseup', () => isResizing = false);

// Spawn PTY
(async () => {
  const shell = await window.api.getShell();
  const id = await window.api.spawnPty(shell, term.cols, term.rows); // use current cols/rows

  term.onData(data => window.api.sendInput(id, data));

  window.api.onData(({ id: incomingId, data }) => {
    if (incomingId === id) term.write(data);
  });

  // Optional: update PTY size if terminal resizes
  window.addEventListener('resize', () => {
    fitAddon.fit();
    window.api.resizePty(id, term.cols, term.rows);
  });
})();
