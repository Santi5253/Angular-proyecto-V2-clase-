const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const ADMIN_USER = 'postgres';
const ADMIN_PASSWORD = '1234';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_USER = process.env.DB_USER || 'caja_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'caja123';
const DB_NAME = process.env.DB_NAME || 'caja_clase_v2';

async function main() {
  const adminPool = new Pool({ host: DB_HOST, port: DB_PORT, user: ADMIN_USER, password: ADMIN_PASSWORD, database: 'postgres' });
  try {
    await adminPool.query(`CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}'`);
    console.log(`Usuario '${DB_USER}' creado.`);
  } catch (err) {
    if (err.code === '42710') console.log(`Usuario '${DB_USER}' ya existe.`);
    else throw err;
  }
  try {
    await adminPool.query(`CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}`);
    console.log(`BD '${DB_NAME}' creada.`);
  } catch (err) {
    if (err.code === '42P04') console.log(`BD '${DB_NAME}' ya existe.`);
    else throw err;
  }
  await adminPool.end();

  const pool = new Pool({ host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASSWORD, database: DB_NAME });
  const sqlDir = path.join(__dirname, '..', 'sql');
  for (const file of ['schema.sql', 'seed.sql']) {
    const full = path.join(sqlDir, file);
    if (!fs.existsSync(full)) { console.warn(`No encontrado: ${file}`); continue; }
    const sql = fs.readFileSync(full, 'utf8');
    console.log(`Ejecutando ${file}...`);
    await pool.query(sql);
  }
  await pool.end();
  console.log('Inicialización completada.');
}

main().catch((err) => { console.error('Error:', err.message); process.exit(1); });
