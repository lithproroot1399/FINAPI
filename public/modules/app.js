/**
 * Inicialização principal da aplicação
 */

import { CreateAccountCard } from './components/CreateAccountCard.js';
import { SelectAccountCard } from './components/SelectAccountCard.js';
import { OperationsCard } from './components/OperationsCard.js';
import { ManageAccountCard } from './components/ManageAccountCard.js';
import { StatementSection } from './components/StatementSection.js';

export class App {
    constructor() {
        this.statement = new StatementSection();
        this.createAccount = new CreateAccountCard();
        this.selectAccount = new SelectAccountCard();
        this.operations = new OperationsCard(this.statement);
        this.manageAccount = new ManageAccountCard();
    }

    init() {
        console.log('✓ Aplicação iniciada com componentes modularizados');
    }
}

// Inicializar app quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
