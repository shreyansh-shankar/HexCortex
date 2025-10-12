export class TerminalInstance {
  constructor(shell, idCallback) {
    this.term = new Terminal({
      theme: { background: '#111', foreground: '#fff' },
      cursorBlink: true
    });
    this.fitAddon = new FitAddon.FitAddon();
    this.term.loadAddon(this.fitAddon);

    this.id = null; // PTY id
    this.shell = shell;
    this.idCallback = idCallback;
    this.termDiv = null; // this will be set by manager
  }

  async open(container) {
    this.term.open(container);
    this.fitAddon.fit();

    this.id = await window.api.spawnPty(this.shell, this.term.cols, this.term.rows);
    this.idCallback(this.id);

    this.term.onData(data => window.api.sendInput(this.id, data));

    window.api.onData(({ id: incomingId, data }) => {
      if (incomingId === this.id) this.term.write(data);
    });

    window.addEventListener('resize', () => {
      this.fitAddon.fit();
      window.api.resizePty(this.id, this.term.cols, this.term.rows);
    });
  }

  focus() {
    this.term.focus();
    this.fitAddon.fit();
  }
}
