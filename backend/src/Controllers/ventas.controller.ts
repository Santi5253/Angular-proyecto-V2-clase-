import type { Request, Response } from 'express';
import { VentaModel } from '../Models/venta.model';

export const getVentas = async (_req: Request, res: Response) => {
  try { res.json(await VentaModel.obtenerTodas()); }
  catch (e) { res.status(500).json({ error: 'Error al obtener ventas' }); }
};

export const getVentasHoy = async (_req: Request, res: Response) => {
  try { res.json(await VentaModel.obtenerHoy()); }
  catch (e) { res.status(500).json({ error: 'Error al obtener ventas del día' }); }
};

export const postVenta = async (req: Request, res: Response) => {
  try {
    const { cliente, documento, medio_pago, subtotal, descuento, total, items } = req.body ?? {};
    if (!medio_pago || subtotal == null || total == null || !Array.isArray(items)) {
      res.status(400).json({ error: 'Datos de venta inválidos' }); return;
    }
    const venta = await VentaModel.crear(
      { cliente: cliente ?? '', documento: documento ?? '', medio_pago, subtotal: Number(subtotal), descuento: Number(descuento ?? 0), total: Number(total) },
      items
    );
    res.status(201).json(venta);
  } catch (e) {
    res.status(500).json({ error: 'Error al registrar la venta' });
  }
};

export const getResumenSemanal = async (_req: Request, res: Response) => {
  try { res.json(await VentaModel.resumenSemanal()); }
  catch (e) { res.status(500).json({ error: 'Error al obtener resumen semanal' }); }
};

export const getResumenMensual = async (_req: Request, res: Response) => {
  try { res.json(await VentaModel.resumenMensual()); }
  catch (e) { res.status(500).json({ error: 'Error al obtener resumen mensual' }); }
};
