const express = require('express');
const router = express.Router();
const db = require('../db/queries-sqlite');

// ==============================
// ACCOUNTS ENDPOINTS
// ==============================

// Criar conta
router.post('/accounts', async (req, res) => {
  try {
    const { cpf, name } = req.body;

    if (!cpf || !name) {
      return res.status(400).json({
        error: 'CPF e nome são obrigatórios',
      });
    }

    // Verifica se CPF já existe
    const existingAccount = db.getAccountByCpf(cpf);
    if (existingAccount) {
      return res.status(400).json({
        error: 'Conta já existe com este CPF',
      });
    }

    const account = db.createAccount(cpf, name);
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar todas as contas
router.get('/accounts', async (req, res) => {
  try {
    const accounts = db.getAllAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar conta por CPF
router.get('/accounts/cpf/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    const account = db.getAccountByCpf(cpf);

    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar conta por ID
router.get('/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const account = db.getAccountById(id);

    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar nome da conta
router.put('/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const account = db.updateAccountName(id, name);

    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar conta
router.delete('/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const account = db.deleteAccount(id);

    if (!account) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    res.json({ message: 'Conta deletada com sucesso', account });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================
// TRANSACTIONS ENDPOINTS
// ==============================

// Depositar
router.post('/deposit', async (req, res) => {
  try {
    const { account_id, amount } = req.body;

    if (!account_id || !amount) {
      return res.status(400).json({
        error: 'account_id e amount são obrigatórios',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        error: 'O valor deve ser maior que 0',
      });
    }

    const transaction = db.deposit(account_id, amount);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sacar
router.post('/withdraw', async (req, res) => {
  try {
    const { account_id, amount } = req.body;

    if (!account_id || !amount) {
      return res.status(400).json({
        error: 'account_id e amount são obrigatórios',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        error: 'O valor deve ser maior que 0',
      });
    }

    const transaction = db.withdraw(account_id, amount);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obter saldo
router.get('/balance/:account_id', async (req, res) => {
  try {
    const { account_id } = req.params;
    const balance = db.getBalance(account_id);
    res.json({ balance });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Obter extrato
router.get('/statement/:account_id', async (req, res) => {
  try {
    const { account_id } = req.params;
    const { start_date, end_date } = req.query;

    const statement = db.getStatement(account_id, start_date, end_date);
    res.json(statement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
