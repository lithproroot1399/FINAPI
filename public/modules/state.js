/**
 * Gerenciamento de estado global da aplicação
 */
export const appState = {
    cpf: null,
    accountId: null,

    setAccount(cpf, accountId) {
        this.cpf = cpf;
        this.accountId = accountId;
    },

    getCpf() {
        return this.cpf;
    },

    getAccountId() {
        return this.accountId;
    },

    clearCpf() {
        this.cpf = null;
        this.accountId = null;
    },

    isAccountSelected() {
        return this.accountId !== null;
    }
};
