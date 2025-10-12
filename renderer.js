import { TerminalManager } from './js/terminalManager.js';

(async () => {
  const shell = await window.api.getShell();
  const tabsContainer = document.getElementById('terminal-tabs');
  const terminalContainer = document.getElementById('terminal-container');

  const manager = new TerminalManager(tabsContainer, terminalContainer, shell);

  // Create first terminal by default
  await manager.createTerminal();

  const newTerminalBtn = document.getElementById('new-terminal-btn');
  newTerminalBtn.addEventListener('click', async () => {
    await manager.createTerminal();
  });

  // Example: create new terminal on key combo Ctrl+Shift+T
  document.addEventListener('keydown', async (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
      await manager.createTerminal();
    }
  });

  // Resizer
  const resizer = document.getElementById('resizer');
  let isResizing = false;
  resizer.addEventListener('mousedown', () => isResizing = true);
  document.addEventListener('mousemove', e => {
    if (!isResizing) return;
    const newHeight = window.innerHeight - e.clientY;
    terminalContainer.style.height = newHeight + 'px';
    if (manager.activeIndex >= 0) manager.terminals[manager.activeIndex].fitAddon.fit();
  });
  document.addEventListener('mouseup', () => isResizing = false);
})();
