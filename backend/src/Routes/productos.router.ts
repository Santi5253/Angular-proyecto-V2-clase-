import { Router } from 'express';
import { getProductos, getProductoPorCodigo, postProducto, putProducto, deleteProducto } from '../Controllers/productos.controller';

const router = Router();
router.get('/', getProductos);
router.get('/:codigo', getProductoPorCodigo);
router.post('/', postProducto);
router.put('/:codigo', putProducto);
router.delete('/:codigo', deleteProducto);
export default router;
