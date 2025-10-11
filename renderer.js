// renderer.js
const term = new window.Terminal({
  theme: { background: '#000000', foreground: '#ffffff' },
  cursorBlink: true
});
term.open(document.getElementById('terminal'));

(async () => {
  const shell = window.api.getShell(); // safe access
  const id = await window.api.spawnPty(shell, 80, 24);

  // send input from terminal to PTY
  term.onData(data => window.api.sendInput(id, data));

  // write PTY output to terminal
  window.api.onData(({ id: incomingId, data }) => {
    if (incomingId === id) term.write(data);
  });
})();
