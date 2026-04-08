/**
 * Componente: Operações (Depósito, Saque, Saldo, Extrato)
 */

import { el, show, formatCurrency } from '../utils.js';
import { appState } from '../state.js';
import * as api from '../api.js';

export class OperationsCard {
    constructor(statementComponent) {
        this.statementComponent = statementComponent;

        this.depositDesc = el('deposit-description');
        this.depositAmount = el('deposit-amount');
        this.btnDeposit = el('btn-deposit');

        this.withdrawDesc = el('withdraw-description');
        this.withdrawAmount = el('withdraw-amount');
        this.btnWithdraw = el('btn-withdraw');

        this.btnBalance = el('btn-balance');
        this.btnStatement = el('btn-statement');
        this.resultDiv = el('op-result');

        this.init();
    }

    init() {
        this.btnDeposit.addEventListener('click', () => this.handleDeposit());
        this.btnWithdraw.addEventListener('click', () => this.handleWithdraw());
        this.btnBalance.addEventListener('click', () => this.handleBalance());
        this.btnStatement.addEventListener('click', () => this.handleStatement());
    }

    async handleDeposit() {
        if (!appState.isAccountSelected()) {
            show('op-result', 'Selecione uma conta');
            return;
        }

        const description = this.depositDesc.value.trim();
        const amount = parseFloat(this.depositAmount.value);

        if (!amount || amount <= 0) {
            show('op-result', 'Valor inválido');
            return;
        }

        try {
            const { status, data } = await api.deposit(appState.getCpf(), description, amount);

            if (status === 201) {
                show('op-result', `Depósito realizado: ${formatCurrency(amount)} ✓`);
                this.depositDesc.value = '';
                this.depositAmount.value = '';
            } else {
                show('op-result', data.error || 'Erro ao depositar');
            }
        } catch (error) {
            show('op-result', 'Erro na requisição');
        }
    }

    async handleWithdraw() {
        if (!appState.isAccountSelected()) {
            show('op-result', 'Selecione uma conta');
            return;
        }

        const description = this.withdrawDesc.value.trim();
        const amount = parseFloat(this.withdrawAmount.value);

        if (!amount || amount <= 0) {
            show('op-result', 'Valor inválido');
            return;
        }

        try {
            const { status, data } = await api.withdraw(appState.getCpf(), description, amount);

            if (status === 201) {
                show('op-result', `Saque realizado: ${formatCurrency(amount)} ✓`);
                this.withdrawAmount.value = '';
                this.withdrawDesc.value = '';
            } else {
                show('op-result', data.error || 'Erro ao sacar');
            }
        } catch (error) {
            show('op-result', 'Erro na requisição');
        }
    }

    async handleBalance() {
        if (!appState.isAccountSelected()) {
            show('op-result', 'Selecione uma conta');
            return;
        }

        try {
            const balance = await api.getBalance(appState.getCpf());
            const balanceNum = Number(balance) || 0;
            const balanceText = formatCurrency(balanceNum);
            const className = balanceNum >= 0 ? 'balance-positive' : 'balance-negative';
            this.resultDiv.innerHTML = `<span class="balance-display ${className}">Saldo: ${balanceText}</span>`;
        } catch (error) {
            show('op-result', 'Erro ao buscar saldo');
        }
    }

    async handleStatement() {
        if (!appState.isAccountSelected()) {
            show('op-result', 'Selecione uma conta');
            return;
        }

        try {
            const statement = await api.getStatement(appState.getCpf());
            this.statementComponent.render(statement);
        } catch (error) {
            show('op-result', 'Erro ao buscar extrato');
        }
    }
}
