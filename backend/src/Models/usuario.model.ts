import { pool } from '../Config/database';

export interface Usuario {
  username: string;
  password: string;
  nombre: string;
  rol: string;
}

export const UsuarioModel = {
  obtenerPorUsername: async (username: string): Promise<Usuario | null> => {
    const r = await pool.query('SELECT username, password, nombre, rol FROM usuarios WHERE username = $1', [username]);
    return r.rows[0] ?? null;
  },
  verificar: (password: string, hashOrPlain: string): boolean => {
    return password === hashOrPlain;
  },
};
