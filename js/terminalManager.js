import { TerminalInstance } from './terminalInstance.js';

export class TerminalManager {
  constructor(tabsContainer, terminalContainer, shell) {
    this.tabsContainer = tabsContainer;
    this.terminalContainer = terminalContainer;
    this.shell = shell;
    this.terminals = [];
    this.tabs = []; // <-- store tab elements corresponding to terminals
    this.activeIndex = -1;
  }

  async createTerminal() {
    const terminal = new TerminalInstance(this.shell, id => terminal.id = id);

    // Terminal container div
    const termDiv = document.createElement('div');
    termDiv.style.width = '100%';
    termDiv.style.height = '100%';
    termDiv.style.display = 'none';
    this.terminalContainer.appendChild(termDiv);

    await terminal.open(termDiv);
    terminal.termDiv = termDiv;

    this.terminals.push(terminal);
    const tabIndex = this.terminals.length - 1;

    // Tab element
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.innerText = `Terminal ${this.terminals.length}`;
    tab.dataset.index = tabIndex;

    tab.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.index);
      this.switchTerminal(idx);
    });

    // Append tab **before the plus button**
    const plusButton = this.tabsContainer.querySelector('#new-terminal-btn');
    if (plusButton) {
      this.tabsContainer.insertBefore(tab, plusButton);
    } else {
      this.tabsContainer.appendChild(tab);
    }

    this.tabs.push(tab); // store tab separately
    this.switchTerminal(tabIndex);
  }

  switchTerminal(index) {
    if (this.activeIndex === index) return;

    // Hide all terminals and remove active class from tabs
    this.terminals.forEach((t, i) => {
      t.termDiv.style.display = 'none';
      if (this.tabs[i]) this.tabs[i].classList.remove('active');
    });

    const activeTerm = this.terminals[index];
    activeTerm.termDiv.style.display = 'block';
    if (this.tabs[index]) this.tabs[index].classList.add('active');
    activeTerm.focus();

    this.activeIndex = index;
  }
}
