import type { Request, Response } from 'express';
import { VentaModel } from '../Models/venta.model';
import { ProductoModel } from '../Models/producto.model';

export const getDashboard = async (_req: Request, res: Response) => {
  try {
    const dashboard = await VentaModel.resumenDashboard();
    const ventasSemanales = await VentaModel.resumenSemanal();
    const ventasMensuales = await VentaModel.resumenMensual();
    res.json({
      kpis: dashboard.kpis,
      categorias: dashboard.categorias,
      criticos: dashboard.criticos,
      ventas_semanales: ventasSemanales,
      ventas_mensuales: ventasMensuales,
    });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener dashboard' });
  }
};
