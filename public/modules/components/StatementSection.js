/**
 * Componente: Seção de Extrato
 */

import { el, formatCurrency, formatDate } from '../utils.js';

export class StatementSection {
    constructor() {
        this.statementDiv = el('statement');
    }

    render(statement) {
        if (!statement || statement.length === 0) {
            this.statementDiv.innerHTML = '<p>Nenhuma transação</p>';
            return;
        }

        let html = '';
        let total = 0;

        statement.forEach(transaction => {
            const amount = transaction.amount;
            const type = transaction.type;
            const date = formatDate(transaction.create_ad);

            if (type === 'credit') {
                total += amount;
            } else {
                total -= amount;
            }

            const className = type === 'credit' ? 'stmt-row credit' : 'stmt-row debit';
            html += `
                <div class="${className}">
                    <div class="stmt-desc">${transaction.description}</div>
                    <div class="stmt-date">${date}</div>
                    <div class="stmt-amount">${formatCurrency(amount)} ${type === 'credit' ? '+' : '-'}</div>
                </div>
            `;
        });

        const totalClass = total >= 0 ? 'balance-positive' : 'balance-negative';
        html += `
            <div class="stmt-total">
                <strong>Total: <span class="${totalClass}">${formatCurrency(total)}</span></strong>
            </div>
        `;

        this.statementDiv.innerHTML = html;
    }

    clear() {
        this.statementDiv.innerHTML = '';
    }
}
