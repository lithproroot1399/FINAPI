const Database = require('better-sqlite3');
const path = require('path');

// Criar ou conectar ao banco SQLite
const dbPath = path.join(__dirname, '..', '..', 'finapi.db');
const db = new Database(dbPath);

// Ativar foreign keys
db.pragma('foreign_keys = ON');

// Criar tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    cpf TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    balance REAL DEFAULT 0.00,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_accounts_cpf ON accounts(cpf);
  CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
`);

module.exports = db;
