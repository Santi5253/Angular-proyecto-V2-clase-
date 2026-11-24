import fs from 'fs';
import path from 'path';
import { pool } from './database';

// Carpeta sql/ en la raíz del backend (funciona igual desde src/ con tsx y desde dist/ con node)
const SQL_DIR = path.join(__dirname, '..', '..', 'sql');

async function runFile(file: string) {
  const sql = fs.readFileSync(path.join(SQL_DIR, file), 'utf8');
  await pool.query(sql);
  console.log(`[db] ${file} ejecutado`);
}

/**
 * Verifica la conexión, crea las tablas si no existen (schema.sql es idempotente)
 * y carga los datos iniciales solo si la tabla productos está vacía.
 */
export async function initDatabase() {
  const r = await pool.query('SELECT current_database() AS db, version() AS v');
  console.log(`[db] Conectado a "${r.rows[0].db}"`);

  await runFile('schema.sql');

  const count = await pool.query('SELECT COUNT(*)::int AS n FROM productos');
  if (count.rows[0].n === 0) {
    await runFile('seed.sql');
  } else {
    console.log('[db] Ya hay datos, se omite seed.sql');
  }
}
