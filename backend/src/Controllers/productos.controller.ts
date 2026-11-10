import type { Request, Response } from 'express';
import { ProductoModel } from '../Models/producto.model';

export const getProductos = async (_req: Request, res: Response) => {
  try {
    const productos = await ProductoModel.obtenerTodos();
    res.json(productos);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

export const getProductoPorCodigo = async (req: Request, res: Response) => {
  try {
    const p = await ProductoModel.obtenerPorCodigo(String(req.params.codigo));
    if (!p) { res.status(404).json({ error: 'No encontrado' }); return; }
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

export const postProducto = async (req: Request, res: Response) => {
  try {
    const creado = await ProductoModel.crear(req.body);
    if (!creado) { res.status(400).json({ error: 'Producto inválido o ya existe' }); return; }
    res.status(201).json(creado);
  } catch (e) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

export const putProducto = async (req: Request, res: Response) => {
  try {
    const upd = await ProductoModel.actualizar(String(req.params.codigo), req.body);
    if (!upd) { res.status(404).json({ error: 'No encontrado o datos inválidos' }); return; }
    res.json(upd);
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

export const deleteProducto = async (req: Request, res: Response) => {
  try {
    const ok = await ProductoModel.eliminar(String(req.params.codigo));
    if (!ok) { res.status(404).json({ error: 'No existe ese código' }); return; }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};
