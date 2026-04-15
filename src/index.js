require('dotenv').config();
const express = require("express");
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();

app.use(express.json());

// Serve static frontend files from project root (index.html, public/)
app.use(express.static(path.join(__dirname, '..')));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Inicializar servidor
const PORT = process.env.PORT || 3333;

const startServer = () => {
  try {
    // Inicializar banco de dados (SQLite inicializa automaticamente)
    require('./db/sqlite');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Banco de dados SQLite inicializado!`);
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();