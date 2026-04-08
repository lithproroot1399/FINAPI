/**
 * Componente: Criar Conta
 */

import { el, show, formatCPF } from '../utils.js';
import * as api from '../api.js';

export class CreateAccountCard {
    constructor() {
        this.cpfInput = el('create-cpf');
        this.nameInput = el('create-name');
        this.btn = el('btn-create');
        this.resultDiv = el('create-result');

        this.init();
    }

    init() {
        this.cpfInput.addEventListener('input', formatCPF);
        this.btn.addEventListener('click', () => this.handleCreate());
    }

    async handleCreate() {
        const cpf = this.cpfInput.value.trim();
        const name = this.nameInput.value.trim();

        if (!cpf || !name) {
            show('create-result', 'Preencha CPF e Nome');
            return;
        }

        try {
            const { status, data } = await api.createAccount(cpf, name);

            if (status === 201) {
                show('create-result', 'Conta criada com sucesso ✓');
                this.cpfInput.value = '';
                this.nameInput.value = '';
            } else {
                show('create-result', data.error || 'Erro ao criar conta');
            }
        } catch (error) {
            show('create-result', 'Erro na requisição');
        }
    }
}
