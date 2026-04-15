# 📲 Como Importar no Insomnia

## Passo 1: Baixar e Instalar Insomnia
Se ainda não tem, baixe em: https://insomnia.rest

## Passo 2: Importar a Collection

### Opção A: Via Menu (Recomendado)
1. Abra o **Insomnia**
2. Clique em **Create** (ou vá para o workspace)
3. Clique em **Import** → **From File**
4. Selecione o arquivo `FINAPI_Insomnia.json`
5. A collection será criada automaticamente! ✅

### Opção B: Via Drag & Drop
1. Abra o Insomnia
2. Arraste o arquivo `FINAPI_Insomnia.json` para a janela
3. Pronto! 🎉

---

## 📋 O que você verá

```
🏦 FINAPI - Banking API
├── 📋 Contas (Accounts)
│   ├── ➕ Criar Conta
│   ├── 📖 Listar Todas as Contas
│   ├── 🔍 Buscar Conta por CPF
│   ├── 🔍 Buscar Conta por ID
│   ├── ✏️ Atualizar Nome da Conta
│   └── 🗑️ Deletar Conta
└── 💰 Transações (Transactions)
    ├── 💵 Depositar
    ├── 💸 Sacar
    ├── 💰 Obter Saldo
    ├── 📋 Obter Extrato
    └── 📋 Obter Extrato (com Filtro de Data)
```

---

## ⚙️ Configurar Variáveis de Ambiente

### Antes de fazer testes:

1. No painel esquerdo, clique em **Environments**
2. Selecione **FINAPI Environment**
3. Edite os valores:
   - `base_url`: `http://localhost:3333/api` (padrão, está correto)
   - `account_id`: Coloque o ID da conta que você criou

**Ou assim:**
1. Clique no ícone de **Engrenagem** ⚙️ no canto superior direito
2. Selecione **Manage Environments**
3. Abra **FINAPI Environment**
4. Atualize as variáveis

---

## 🧪 Teste Rápido

### 1️⃣ Criar Conta (começa aqui!)
1. Na lista à esquerda, clique em **➕ Criar Conta**
2. Clique no botão **Send** (ou `Ctrl+Enter`)
3. Copie o `id` da resposta
4. Cole em `FINAPI Environment` → `account_id`

### 2️⃣ Fazer Depósito
1. Clique em **💵 Depositar**
2. Modifique o valor de `amount` se quiser
3. Clique em **Send**

### 3️⃣ Ver Saldo
1. Clique em **💰 Obter Saldo**
2. Clique em **Send**
3. Veja o saldo atualizado! 💸

---

## 💡 Dicas

### Usar a resposta anterior como variável
Se quiser usar o `id` da resposta anterior automaticamente:

1. Clique na guia **Test** da resposta
2. Adicione:
```javascript
if (response.ok) {
    const data = JSON.parse(response.body);
    pm.environment.set("account_id", data.id);
}
```

### Mudar a URL base (se rodar em outro lugar)
1. Vá em **Environments** → **FINAPI Environment**
2. Atualize `base_url` para: `http://seu-dominio:porta/api`

### Adicionar headers customizados
Se precisar de autenticação no futuro:
1. Clique em **Headers** na request
2. Adicione header: `Authorization: Bearer SEU_TOKEN`

---

## 🔗 Endpoints Rápidos

| Request | URL |
|---------|-----|
| Criar Conta | `POST /accounts` |
| Listar | `GET /accounts` |
| Depositar | `POST /deposit` |
| Sacar | `POST /withdraw` |
| Saldo | `GET /balance/:id` |
| Extrato | `GET /statement/:id` |

---

## ❓ Dúvidas?

Se tiver erro `connect ECONNREFUSED`:
- Certifique que o servidor Node.js está rodando: `npm run dev`
- Verifique a porta em `.env` (padrão: 3333)

Se receber erro de CPF duplicado:
- Use um CPF diferente, ou
- Delete a conta e crie novamente

---

**Divirta-se testando a API!** 🚀
