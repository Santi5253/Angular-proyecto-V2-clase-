import { Router } from 'express';
import { getVentas, getVentasHoy, postVenta, getResumenSemanal, getResumenMensual } from '../Controllers/ventas.controller';

const router = Router();
router.get('/', getVentas);
router.get('/hoy', getVentasHoy);
router.post('/', postVenta);
router.get('/resumen/semanal', getResumenSemanal);
router.get('/resumen/mensual', getResumenMensual);
export default router;
