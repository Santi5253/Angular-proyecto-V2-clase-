import { pool } from '../Config/database';

export interface VentaItem {
  codigo: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  fecha: Date;
  cliente: string;
  documento: string;
  medio_pago: string;
  subtotal: number;
  descuento: number;
  total: number;
  items?: VentaItem[];
}

export const VentaModel = {
  crear: async (venta: Omit<Venta, 'id' | 'fecha' | 'items'>, items: VentaItem[]): Promise<Venta> => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const r = await client.query(
        'INSERT INTO ventas (cliente, documento, medio_pago, subtotal, descuento, total) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, fecha',
        [venta.cliente, venta.documento, venta.medio_pago, venta.subtotal, venta.descuento, venta.total]
      );
      const ventaId = r.rows[0].id;
      for (const it of items) {
        await client.query(
          'INSERT INTO venta_items (venta_id, codigo, cantidad, precio_unitario, subtotal) VALUES ($1,$2,$3,$4,$5)',
          [ventaId, it.codigo, it.cantidad, it.precio_unitario, it.subtotal]
        );
      }
      await client.query('COMMIT');
      return { id: ventaId, fecha: r.rows[0].fecha, ...venta, items };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
  obtenerTodas: async (): Promise<Venta[]> => {
    const r = await pool.query('SELECT id, fecha, cliente, documento, medio_pago, subtotal, descuento, total FROM ventas ORDER BY fecha DESC');
    return r.rows.map((x) => ({ id: x.id, fecha: x.fecha, cliente: x.cliente, documento: x.documento, medio_pago: x.medio_pago, subtotal: Number(x.subtotal), descuento: Number(x.descuento), total: Number(x.total) }));
  },
  obtenerHoy: async (): Promise<Venta[]> => {
    const r = await pool.query("SELECT id, fecha, cliente, documento, medio_pago, subtotal, descuento, total FROM ventas WHERE fecha::date = CURRENT_DATE ORDER BY fecha DESC");
    return r.rows.map((x) => ({ id: x.id, fecha: x.fecha, cliente: x.cliente, documento: x.documento, medio_pago: x.medio_pago, subtotal: Number(x.subtotal), descuento: Number(x.descuento), total: Number(x.total) }));
  },
  resumenSemanal: async () => {
    const r = await pool.query("SELECT to_char(date_trunc('week', fecha), 'IYYY-\"W\"IW') AS semana, COALESCE(SUM(total),0)::numeric AS total, COUNT(*)::int AS cantidad FROM ventas GROUP BY date_trunc('week', fecha) ORDER BY date_trunc('week', fecha)");
    return r.rows.map((x) => ({ semana: x.semana, total: Number(x.total), cantidad: Number(x.cantidad) }));
  },
  resumenMensual: async () => {
    const r = await pool.query("SELECT to_char(date_trunc('month', fecha), 'YYYY-MM') AS mes, COALESCE(SUM(total),0)::numeric AS total, COUNT(*)::int AS cantidad FROM ventas GROUP BY date_trunc('month', fecha) ORDER BY date_trunc('month', fecha)");
    return r.rows.map((x) => ({ mes: x.mes, total: Number(x.total), cantidad: Number(x.cantidad) }));
  },
  resumenDashboard: async () => {
    const kpi = await pool.query('SELECT COUNT(*)::int AS total_productos, COALESCE(SUM(stock),0)::int AS total_stock, COALESCE(SUM(precio*stock),0)::numeric AS valor_inventario FROM productos');
    const cat = await pool.query('SELECT categoria, COUNT(*)::int AS cantidad_productos, COALESCE(SUM(stock),0)::int AS stock_total, COALESCE(SUM(precio*stock),0)::numeric AS valor_total FROM productos GROUP BY categoria ORDER BY categoria');
    const crit = await pool.query('SELECT codigo, nombre, categoria, stock, precio FROM productos WHERE stock <= 5 ORDER BY stock ASC');
    return {
      kpis: { total_productos: Number(kpi.rows[0].total_productos), total_stock: Number(kpi.rows[0].total_stock), valor_inventario: Number(kpi.rows[0].valor_inventario) },
      categorias: cat.rows.map((x) => ({ categoria: x.categoria, cantidad_productos: Number(x.cantidad_productos), stock_total: Number(x.stock_total), valor_total: Number(x.valor_total) })),
      criticos: crit.rows.map((x) => ({ codigo: x.codigo, nombre: x.nombre, categoria: x.categoria, stock: Number(x.stock), precio: Number(x.precio) })),
    };
  },
};
