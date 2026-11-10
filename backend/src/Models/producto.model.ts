import { pool } from '../Config/database';

export interface Producto {
  codigo: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

export const ProductoModel = {
  obtenerTodos: async (): Promise<Producto[]> => {
    const r = await pool.query('SELECT codigo, nombre, categoria, precio, stock FROM productos ORDER BY codigo');
    return r.rows.map((x) => ({ codigo: x.codigo, nombre: x.nombre, categoria: x.categoria, precio: Number(x.precio), stock: Number(x.stock) }));
  },
  obtenerPorCodigo: async (codigo: string): Promise<Producto | null> => {
    const r = await pool.query('SELECT codigo, nombre, categoria, precio, stock FROM productos WHERE LOWER(codigo) = LOWER($1)', [codigo]);
    return r.rows[0] ? { codigo: r.rows[0].codigo, nombre: r.rows[0].nombre, categoria: r.rows[0].categoria, precio: Number(r.rows[0].precio), stock: Number(r.rows[0].stock) } : null;
  },
  crear: async (p: Producto): Promise<Producto | null> => {
    const existe = await ProductoModel.obtenerPorCodigo(p.codigo);
    if (existe) return null;
    await pool.query('INSERT INTO productos (codigo, nombre, categoria, precio, stock) VALUES ($1,$2,$3,$4,$5)', [p.codigo, p.nombre, p.categoria, p.precio, p.stock]);
    return p;
  },
  actualizar: async (codigo: string, cambios: Partial<Producto>): Promise<Producto | null> => {
    const actual = await ProductoModel.obtenerPorCodigo(codigo);
    if (!actual) return null;
    const upd = { ...actual, ...cambios, codigo: actual.codigo };
    await pool.query('UPDATE productos SET nombre=$1, categoria=$2, precio=$3, stock=$4 WHERE LOWER(codigo)=LOWER($5)', [upd.nombre, upd.categoria, upd.precio, upd.stock, codigo]);
    return upd;
  },
  eliminar: async (codigo: string): Promise<boolean> => {
    const r = await pool.query('DELETE FROM productos WHERE LOWER(codigo)=LOWER($1)', [codigo]);
    return (r.rowCount ?? 0) > 0;
  },
};
