/**
 * Gerenciamento de estado global da aplicação
 */
export const appState = {
    cpf: null,

    setCpf(cpf) {
        this.cpf = cpf;
    },

    getCpf() {
        return this.cpf;
    },

    clearCpf() {
        this.cpf = null;
    },

    isAccountSelected() {
        return this.cpf !== null;
    }
};
