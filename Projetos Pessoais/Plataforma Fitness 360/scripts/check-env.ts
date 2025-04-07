import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const requiredEnvVars = {
  'billing-svc': [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASS',
    'DB_NAME',
    'STRIPE_SECRET_KEY',
    'KAFKA_BROKERS'
  ],
  'members-svc': [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASS',
    'DB_NAME',
    'KAFKA_BROKERS'
  ],
  'gateway-app': [
    'PORT',
    'SERVICES_ENDPOINTS'
  ]
};

function validateEnv(service: string) {
  const envPath = path.join(process.cwd(), 'backend', service, '.env');
  
  if (!fs.existsSync(envPath)) {
    console.error(`❌ .env file not found for ${service}`);
    process.exit(1);
  }

  config({ path: envPath });
  
  const missingVars = requiredEnvVars[service].filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables for ${service}:`);
    missingVars.forEach((v) => console.error(`   - ${v}`));
    process.exit(1);
  }

  console.log(`✅ All required environment variables present for ${service}`);
}

// Validate all services
Object.keys(requiredEnvVars).forEach(validateEnv); 