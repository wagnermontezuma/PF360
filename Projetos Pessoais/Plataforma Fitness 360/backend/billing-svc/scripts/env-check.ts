import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASS',
  'STRIPE_SECRET_KEY',
  'KAFKA_BROKERS',
  'API_PORT'
];

function checkEnvVars() {
  const envPath = path.resolve(__dirname, '../.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Arquivo .env não encontrado');
    console.log('ℹ️  Copie .env.example para .env e configure as variáveis');
    process.exit(1);
  }

  dotenv.config({ path: envPath });

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Variáveis de ambiente obrigatórias não encontradas:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    process.exit(1);
  }

  console.log('✅ Todas as variáveis de ambiente obrigatórias estão configuradas');
}

checkEnvVars(); 