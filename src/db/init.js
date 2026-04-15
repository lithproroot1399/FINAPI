const pool = require('./config');
const fs = require('fs');
const path = require('path');

const initDatabase = async () => {
  try {
    console.log('🔄 Inicializando banco de dados...');

    // Ler arquivo schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Executar schema
    await pool.query(schema);

    console.log('✅ Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error.message);
    process.exit(1);
  }
};

module.exports = initDatabase;
