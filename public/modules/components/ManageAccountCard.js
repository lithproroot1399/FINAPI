/**
 * Componente: Gerenciar Conta
 */

import { el, show } from '../utils.js';
import { appState } from '../state.js';
import * as api from '../api.js';

export class ManageAccountCard {
    constructor() {
        this.nameInput = el('update-name');
        this.btnUpdate = el('btn-update');
        this.btnDelete = el('btn-delete');
        this.resultDiv = el('manage-result');

        this.init();
    }

    init() {
        this.btnUpdate.addEventListener('click', () => this.handleUpdate());
        this.btnDelete.addEventListener('click', () => this.handleDelete());
    }

    async handleUpdate() {
        if (!appState.isAccountSelected()) {
            show('manage-result', 'Selecione uma conta');
            return;
        }

        const newName = this.nameInput.value.trim();
        if (!newName) {
            show('manage-result', 'Digite o novo nome');
            return;
        }

        try {
            const { status, data } = await api.updateAccountName(appState.getCpf(), newName);

            if (status === 200) {
                show('manage-result', 'Nome atualizado com sucesso ✓');
                this.nameInput.value = '';
            } else {
                show('manage-result', data.error || 'Erro ao atualizar');
            }
        } catch (error) {
            show('manage-result', 'Erro na requisição');
        }
    }

    async handleDelete() {
        if (!appState.isAccountSelected()) {
            show('manage-result', 'Selecione uma conta');
            return;
        }

        const confirm = window.confirm('Tem certeza que deseja deletar a conta?');
        if (!confirm) return;

        try {
            const { status, data } = await api.deleteAccount(appState.getCpf());

            if (status === 200) {
                show('manage-result', 'Conta deletada com sucesso ✓');
                appState.clearCpf();
                setTimeout(() => window.location.reload(), 500);
            } else {
                show('manage-result', data.error || 'Erro ao deletar');
            }
        } catch (error) {
            show('manage-result', 'Erro na requisição');
        }
    }
}
