import { TerminalInstance } from './terminalInstance.js';

export class TerminalManager {
    constructor(tabsContainer, terminalContainer, shell) {
        this.tabsContainer = tabsContainer;
        this.terminalContainer = terminalContainer;
        this.shell = shell;
        this.terminals = [];
        this.tabs = [];
        this.activeIndex = -1;
    }

    async createTerminal(isFirst = false) {
        const terminal = new TerminalInstance(this.shell, id => terminal.id = id);

        const termDiv = document.createElement('div');
        termDiv.style.width = '100%';
        termDiv.style.height = '100%';
        termDiv.style.display = 'none';
        this.terminalContainer.appendChild(termDiv);

        await terminal.open(termDiv);
        terminal.termDiv = termDiv;

        this.terminals.push(terminal);
        const tabIndex = this.terminals.length - 1;

        // Create tab
        const tab = document.createElement('div');
        tab.classList.add('tab');
        tab.dataset.index = tabIndex;

        const label = document.createElement('span');
        label.innerText = `Shell ${this.terminals.length}`;
        tab.appendChild(label);

        // Only add close button if NOT first terminal
        if (!isFirst) {
            const closeBtn = document.createElement('span');
            closeBtn.classList.add('tab-close-btn');
            closeBtn.innerHTML = '<i class="fas fa-times"></i>'; // Font Awesome X icon
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeTerminal(tabIndex);
            });
            tab.appendChild(closeBtn);
        }


        tab.addEventListener('click', () => this.switchTerminal(tabIndex));

        // Insert before the "+" button
        const plusButton = this.tabsContainer.querySelector('#new-terminal-btn');
        if (plusButton) this.tabsContainer.insertBefore(tab, plusButton);
        else this.tabsContainer.appendChild(tab);

        this.tabs.push(tab);

        this.switchTerminal(tabIndex);
    }

    switchTerminal(index) {
        if (this.activeIndex === index) return;

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

    closeTerminal(index) {
        if (index === 0) return; // never close first terminal

        const term = this.terminals[index];
        if (!term) return;

        term.termDiv.remove();
        this.tabs[index].remove();

        this.terminals.splice(index, 1);
        this.tabs.splice(index, 1);

        // Reindex remaining tabs
        this.tabs.forEach((tab, i) => {
            tab.dataset.index = i;
        });

        // Adjust active index
        let newActive = this.activeIndex;
        if (this.activeIndex === index) {
            newActive = index - 1; // switch to previous terminal
        } else if (this.activeIndex > index) {
            newActive = this.activeIndex - 1;
        }

        this.switchTerminal(newActive);
    }
}
