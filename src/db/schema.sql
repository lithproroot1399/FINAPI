-- Criar tabela de contas
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'deposit' ou 'withdraw'
  amount DECIMAL(15, 2) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description VARCHAR(255),
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_accounts_cpf ON accounts(cpf);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at na tabela accounts
CREATE TRIGGER trigger_update_accounts_timestamp
BEFORE UPDATE ON accounts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
