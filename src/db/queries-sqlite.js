const db = require('./sqlite');
const { v4: uuidv4 } = require('uuid');

// ==============================
// ACCOUNTS QUERIES
// ==============================

const createAccount = (cpf, name) => {
  const id = uuidv4();
  try {
    const stmt = db.prepare(`
      INSERT INTO accounts (id, cpf, name, balance)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(id, cpf, name, 0);
    return getAccountById(id);
  } catch (error) {
    throw new Error(`Erro ao criar conta: ${error.message}`);
  }
};

const getAccountByCpf = (cpf) => {
  try {
    const stmt = db.prepare('SELECT * FROM accounts WHERE cpf = ?');
    return stmt.get(cpf);
  } catch (error) {
    throw new Error(`Erro ao buscar conta: ${error.message}`);
  }
};

const getAccountById = (id) => {
  try {
    const stmt = db.prepare('SELECT * FROM accounts WHERE id = ?');
    return stmt.get(id);
  } catch (error) {
    throw new Error(`Erro ao buscar conta: ${error.message}`);
  }
};

const getAllAccounts = () => {
  try {
    const stmt = db.prepare('SELECT * FROM accounts ORDER BY created_at DESC');
    return stmt.all();
  } catch (error) {
    throw new Error(`Erro ao buscar contas: ${error.message}`);
  }
};

const updateAccountName = (id, name) => {
  try {
    const stmt = db.prepare(`
      UPDATE accounts
      SET name = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(name, id);
    return getAccountById(id);
  } catch (error) {
    throw new Error(`Erro ao atualizar conta: ${error.message}`);
  }
};

const deleteAccount = (id) => {
  try {
    const account = getAccountById(id);
    if (!account) return null;
    
    const stmt = db.prepare('DELETE FROM accounts WHERE id = ?');
    stmt.run(id);
    return account;
  } catch (error) {
    throw new Error(`Erro ao deletar conta: ${error.message}`);
  }
};

// ==============================
// TRANSACTIONS QUERIES
// ==============================

const deposit = (accountId, amount, description = 'Depósito') => {
  const transactionId = uuidv4();
  try {
    const transaction = db.transaction(() => {
      // Verificar se conta existe
      const account = getAccountById(accountId);
      if (!account) {
        throw new Error('Conta não encontrada');
      }

      // Atualizar saldo
      const updateStmt = db.prepare(`
        UPDATE accounts
        SET balance = balance + ?
        WHERE id = ?
      `);
      updateStmt.run(amount, accountId);

      // Registrar transação
      const insertStmt = db.prepare(`
        INSERT INTO transactions (id, account_id, type, amount, description)
        VALUES (?, ?, 'deposit', ?, ?)
      `);
      insertStmt.run(transactionId, accountId, amount, description);

      return getTransactionById(transactionId);
    });

    return transaction();
  } catch (error) {
    throw new Error(`Erro ao depositar: ${error.message}`);
  }
};

const withdraw = (accountId, amount, description = 'Saque') => {
  const transactionId = uuidv4();
  try {
    const transaction = db.transaction(() => {
      // Verificar saldo
      const account = getAccountById(accountId);
      if (!account) {
        throw new Error('Conta não encontrada');
      }

      if (account.balance < amount) {
        throw new Error('Saldo insuficiente');
      }

      // Atualizar saldo
      const updateStmt = db.prepare(`
        UPDATE accounts
        SET balance = balance - ?
        WHERE id = ?
      `);
      updateStmt.run(amount, accountId);

      // Registrar transação
      const insertStmt = db.prepare(`
        INSERT INTO transactions (id, account_id, type, amount, description)
        VALUES (?, ?, 'withdraw', ?, ?)
      `);
      insertStmt.run(transactionId, accountId, amount, description);

      return getTransactionById(transactionId);
    });

    return transaction();
  } catch (error) {
    throw new Error(`Erro ao sacar: ${error.message}`);
  }
};

const getBalance = (accountId) => {
  try {
    const account = getAccountById(accountId);
    if (!account) {
      throw new Error('Conta não encontrada');
    }
    return account.balance;
  } catch (error) {
    throw new Error(`Erro ao buscar saldo: ${error.message}`);
  }
};

const getStatement = (accountId, startDate = null, endDate = null) => {
  try {
    let query = 'SELECT * FROM transactions WHERE account_id = ?';
    const params = [accountId];

    if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY date DESC';

    const stmt = db.prepare(query);
    return stmt.all(...params);
  } catch (error) {
    throw new Error(`Erro ao buscar extrato: ${error.message}`);
  }
};

const getTransactionById = (id) => {
  try {
    const stmt = db.prepare('SELECT * FROM transactions WHERE id = ?');
    return stmt.get(id);
  } catch (error) {
    throw new Error(`Erro ao buscar transação: ${error.message}`);
  }
};

module.exports = {
  // Accounts
  createAccount,
  getAccountByCpf,
  getAccountById,
  getAllAccounts,
  updateAccountName,
  deleteAccount,
  // Transactions
  deposit,
  withdraw,
  getBalance,
  getStatement,
};
