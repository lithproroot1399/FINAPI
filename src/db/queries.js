const pool = require('./config');
const { v4: uuidv4 } = require('uuid');

// ==============================
// ACCOUNTS QUERIES
// ==============================

const createAccount = async (cpf, name) => {
  const id = uuidv4();
  const query = `
    INSERT INTO accounts (id, cpf, name, balance)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [id, cpf, name, 0]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Erro ao criar conta: ${error.message}`);
  }
};

const getAccountByCpf = async (cpf) => {
  const query = 'SELECT * FROM accounts WHERE cpf = $1;';
  try {
    const result = await pool.query(query, [cpf]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Erro ao buscar conta: ${error.message}`);
  }
};

const getAccountById = async (id) => {
  const query = 'SELECT * FROM accounts WHERE id = $1;';
  try {
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Erro ao buscar conta: ${error.message}`);
  }
};

const getAllAccounts = async () => {
  const query = 'SELECT * FROM accounts ORDER BY created_at DESC;';
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(`Erro ao buscar contas: ${error.message}`);
  }
};

const updateAccountName = async (id, name) => {
  const query = `
    UPDATE accounts
    SET name = $1
    WHERE id = $2
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [name, id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Erro ao atualizar conta: ${error.message}`);
  }
};

const deleteAccount = async (id) => {
  const query = 'DELETE FROM accounts WHERE id = $1 RETURNING *;';
  try {
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Erro ao deletar conta: ${error.message}`);
  }
};

// ==============================
// TRANSACTIONS QUERIES
// ==============================

const deposit = async (accountId, amount, description = 'Depósito') => {
  const transactionId = uuidv4();
  const query = `
    BEGIN;
    UPDATE accounts SET balance = balance + $1 WHERE id = $2;
    INSERT INTO transactions (id, account_id, type, amount, description)
    VALUES ($3, $2, 'deposit', $1, $4)
    RETURNING *;
    COMMIT;
  `;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, accountId]
    );
    const result = await client.query(
      `INSERT INTO transactions (id, account_id, type, amount, description)
       VALUES ($1, $2, 'deposit', $3, $4)
       RETURNING *;`,
      [transactionId, accountId, amount, description]
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw new Error(`Erro ao depositar: ${error.message}`);
  } finally {
    client.release();
  }
};

const withdraw = async (accountId, amount, description = 'Saque') => {
  const transactionId = uuidv4();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verifica saldo
    const checkBalance = await client.query(
      'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE',
      [accountId]
    );

    if (!checkBalance.rows[0]) {
      throw new Error('Conta não encontrada');
    }

    if (checkBalance.rows[0].balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    // Atualiza saldo
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, accountId]
    );

    // Registra transação
    const result = await client.query(
      `INSERT INTO transactions (id, account_id, type, amount, description)
       VALUES ($1, $2, 'withdraw', $3, $4)
       RETURNING *;`,
      [transactionId, accountId, amount, description]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw new Error(`Erro ao sacar: ${error.message}`);
  } finally {
    client.release();
  }
};

const getBalance = async (accountId) => {
  const query = 'SELECT balance FROM accounts WHERE id = $1;';
  try {
    const result = await pool.query(query, [accountId]);
    if (!result.rows[0]) {
      throw new Error('Conta não encontrada');
    }
    return result.rows[0].balance;
  } catch (error) {
    throw new Error(`Erro ao buscar saldo: ${error.message}`);
  }
};

const getStatement = async (accountId, startDate = null, endDate = null) => {
  let query = `
    SELECT * FROM transactions
    WHERE account_id = $1
  `;
  const params = [accountId];

  if (startDate && endDate) {
    query += ` AND date BETWEEN $2 AND $3`;
    params.push(startDate, endDate);
  }

  query += ` ORDER BY date DESC;`;

  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    throw new Error(`Erro ao buscar extrato: ${error.message}`);
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
