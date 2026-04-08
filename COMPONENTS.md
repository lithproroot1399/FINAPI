# 📁 Estrutura de Componentes - FINAPI

## Organização Modularizada

A aplicação foi reorganizada em componentes bem definidos e reutilizáveis.

### 📂 Estrutura de Pastas

```
public/
├── modules/
│   ├── app.js                    # 🚀 Inicialização da aplicação
│   ├── state.js                  # 🔄 Gerenciamento de estado global
│   ├── utils.js                  # 🛠️  Funções utilitárias
│   ├── api.js                    # 🌐 Chamadas à API
│   └── components/
│       ├── CreateAccountCard.js  # Criar nova conta
│       ├── SelectAccountCard.js  # Selecionar conta ativa
│       ├── OperationsCard.js     # Depósito, saque, saldo, extrato
│       ├── ManageAccountCard.js  # Gerenciar conta
│       └── StatementSection.js   # Visualizar extrato
├── frontend.js                   # ⚠️ Antigo (pode ser deletado)
└── styles.css                    # Estilos CSS
```

## 📦 Componentes

### 1. **CreateAccountCard** 
- Responsável por criar nova conta
- Valida CPF e nome
- Formata CPF automaticamente
- Exibe mensagens de sucesso/erro

### 2. **SelectAccountCard**
- Permite selecionar uma conta para operações
- Atualiza o estado global
- Mostra CPF da conta ativa

### 3. **OperationsCard**
- Gerencia as operações: depósito, saque, saldo, extrato
- Valida campos de entrada
- Se comunica com StatementSection para exibir extrato
- Exibe saldo com cor (verde/vermelho)

### 4. **ManageAccountCard**
- Atualiza nome da conta
- Deleta conta (com confirmação)
- Apenas funciona com conta selecionada

### 5. **StatementSection**
- Renderiza o extrato com cores (crédito=verde, débito=vermelho)
- Mostra data e valor de cada transação
- Calcula total

## 🔧 Módulos de Suporte

### **state.js** - Gerenciamento de Estado
```javascript
appState.setCpf(cpf)       // Define CPF ativo
appState.getCpf()          // Retorna CPF ativo
appState.isAccountSelected() // Verifica se há conta ativa
appState.clearCpf()        // Limpa CPF ativo
```

### **utils.js** - Funções Utilitárias
```javascript
el(id)                 // Seleciona elemento por ID (shorthand)
show(id, text)        // Define texto em elemento
formatCurrency(value) // Formata valor como moeda
formatDate(date)      // Formata data/hora
formatCPF(event)      // Formata input de CPF
jsonResponse(res)     // Parse JSON com fallback
```

### **api.js** - Comunicação com Servidor
```javascript
await api.createAccount(cpf, name)
await api.deposit(cpf, description, amount)
await api.withdraw(cpf, description, amount)
await api.getBalance(cpf)
await api.getStatement(cpf)
await api.updateAccountName(cpf, newName)
await api.deleteAccount(cpf)
```

## ✅ Benefícios da Reorganização

✨ **Modularidade** - Cada componente tem responsabilidade única  
🔄 **Reutilização** - Componentes podem ser reutilizados em outras partes  
🧪 **Testabilidade** - Mais fácil testar código isolado  
🛠️ **Manutenção** - Código mais limpo e organizado  
📚 **Escalabilidade** - Fácil adicionar novos componentes/funcionalidades  

## 🚀 Como Usar

O arquivo `app.js` inicializa automaticamente todos os componentes quando o DOM está pronto.

Se precisar adicionar um novo componente:

1. Criar arquivo em `/public/modules/components/NovoComponente.js`
2. Exportar classe do componente
3. Importar e instanciar em `app.js`

```javascript
import { NovoComponente } from './components/NovoComponente.js';
// ...
this.novoComponente = new NovoComponente();
```

---

**Criado em:** 2026  
**Versão:** 1.0  
**Status:** ✅ Ativo e Modularizado
