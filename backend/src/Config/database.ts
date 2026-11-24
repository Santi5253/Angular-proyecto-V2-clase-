import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// En Railway se usa DATABASE_URL (referencia a la variable del servicio Postgres).
// En local se puede seguir usando DB_HOST, DB_USER, etc. desde el archivo .env.
function buildConfig(): PoolConfig {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }

  const requiredVariables = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  for (const variable of requiredVariables) {
    if (!process.env[variable]) {
      throw new Error(`Falta configurar DATABASE_URL o la variable ${variable}`);
    }
  }

  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

export const pool = new Pool(buildConfig());

pool.on('error', (err) => {
  console.error('Error inesperado en la conexión a PostgreSQL:', err.message);
});
