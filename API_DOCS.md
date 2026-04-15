# 📚 Documentação da API FINAPI com SQLite

## ✅ Status: Banco de dados configurado e funcionando!

**Banco de dados**: SQLite (desenvolvimento rápido, sem dependências externas)  
**Arquivo**: `finapi.db` (criado automaticamente na raiz do projeto)  
**Base URL**: `http://localhost:3333/api`

---

## 📋 Endpoints

### Contas (Accounts)

#### ✏️ Criar conta
```bash
POST /api/accounts
Content-Type: application/json

{
  "cpf": "12345678901",
  "name": "João Silva"
}
```

#### 📖 Listar todas as contas
```bash
GET /api/accounts
```

#### 🔍 Buscar conta por CPF
```bash
GET /api/accounts/cpf/:cpf
```

#### 🔍 Buscar conta por ID
```bash
GET /api/accounts/:id
```

#### 📝 Atualizar nome da conta
```bash
PUT /api/accounts/:id
Content-Type: application/json

{
  "name": "Novo Nome"
}
```

#### 🗑️ Deletar conta
```bash
DELETE /api/accounts/:id
```

---

### Transações (Transactions)

#### 💰 Depositar
```bash
POST /api/deposit
Content-Type: application/json

{
  "account_id": "uuid-da-conta",
  "amount": 100.50
}
```

#### 💸 Sacar
```bash
POST /api/withdraw
Content-Type: application/json

{
  "account_id": "uuid-da-conta",
  "amount": 50.00
}
```

#### 💵 Obter saldo
```bash
GET /api/balance/:account_id
```

#### 📋 Obter extrato
```bash
GET /api/statement/:account_id
```

**Com filtro de datas:**
```bash
GET /api/statement/:account_id?start_date=2024-01-01&end_date=2024-12-31
```

---

## 🧪 Exemplo com cURL

### Criar conta
```bash
curl -X POST http://localhost:3333/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "name": "João Silva"
  }'
```

### Depositar
```bash
curl -X POST http://localhost:3333/api/deposit \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": "3a1b5c8d-4e2f-11eb-ae93-0242ac120002",
    "amount": 500
  }'
```

### Obter saldo
```bash
curl http://localhost:3333/api/balance/3a1b5c8d-4e2f-11eb-ae93-0242ac120002
```

---

## 📊 Estrutura do Banco de Dados

### Tabela: `accounts`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT (UUID) | ID único |
| cpf | TEXT | CPF único |
| name | TEXT | Nome da conta |
| balance | REAL | Saldo atual |
| created_at | TEXT | Data de criação |
| updated_at | TEXT | Última atualização |

### Tabela: `transactions`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | TEXT (UUID) | ID único |
| account_id | TEXT | ID da conta |
| type | TEXT | 'deposit' ou 'withdraw' |
| amount | REAL | Valor |
| date | TEXT | Data/hora |
| description | TEXT | Descrição |

---

## 🚀 Começar a usar

1. **Certificar que o servidor está rodando:**
   ```bash
   npm run dev
   ```

2. **Criar uma conta:**
   ```bash
   curl -X POST http://localhost:3333/api/accounts \
     -H "Content-Type: application/json" \
     -d '{"cpf": "12345678901", "name": "Minha Conta"}'
   ```

3. **Guardar o `id` retornado**

4. **Fazer transações com o `id`**

---

## 💡 Recursos

✅ Transações atômicas (sem risco de inconsistência)  
✅ Validação automática de saldo  
✅ Sem limite de contas  
✅ Histórico completo de transações  
✅ Filtro de datas no extrato  
✅ CPF único (sem duplicação)  

---

## 🔄 Migração para PostgreSQL (Produção)

Se quiser usar PostgreSQL em produção:

1. Instale PostgreSQL
2. Substitua `require('./db/queries-sqlite')` por `require('./db/queries')` em `src/routes/api.js`
3. Configure `.env` com credenciais do PostgreSQL
4. Execute o schema em `src/db/schema.sql`

---

**Desenvolvido com Node.js + Express + SQLite** 🚀
