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
        this.input.addEventListener('input', () => this.formatCpf());
        this.updateDisplay();
    }

    handleSetCpf() {
        const cpf = this.input.value.replace(/\D/g, '');
        if (!cpf) {
            show('op-result', 'Digite um CPF');
            return;
        }
        if (cpf.length !== 11) {
            show('op-result', 'CPF deve ter 11 dígitos');
            return;
        }

        appState.setCpf(cpf);
        this.updateDisplay();
        show('op-result', `Conta selecionada: ${cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}`);
        this.input.value = '';
    }

    updateDisplay() {
        const cpf = appState.getCpf();
        const formatted = cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : 'nenhuma';
        this.display.innerText = formatted;
    }

    formatCpf() {
        let value = this.input.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
        this.input.value = value;
    }
}
