/**
 * Componente: Selecionar Conta
 */

import { el, show } from '../utils.js';
import { appState } from '../state.js';

export class SelectAccountCard {
    constructor() {
        this.input = el('active-cpf');
        this.btn = el('btn-set-cpf');
        this.display = el('current-cpf');
        this.resultDiv = el('op-result');

        this.init();
    }

    init() {
        this.btn.addEventListener('click', () => this.handleSetCpf());
        this.updateDisplay();
    }

    handleSetCpf() {
        const cpf = this.input.value.trim();
        if (!cpf) {
            show('op-result', 'Digite um CPF');
            return;
        }

        appState.setCpf(cpf);
        this.updateDisplay();
        show('op-result', `Conta selecionada: ${cpf}`);
        this.input.value = '';
    }

    updateDisplay() {
        const cpf = appState.getCpf();
        this.display.innerText = cpf || 'nenhuma';
    }
}
