import express from 'express';
import cors from 'cors';
import authRoutes from './Routes/auth.router';
import productosRoutes from './Routes/productos.router';
import ventasRoutes from './Routes/ventas.router';
import dashboardRoutes from './Routes/dashboard.router';

const app = express();
// FRONT_URL admite varios orígenes separados por coma; se quita la "/" final para evitar fallos de CORS
const allowedOrigins = (process.env.FRONT_URL || 'http://localhost:4200')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/api/v1/health', (_req, res) => res.json({ status: 'OK' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/productos', productosRoutes);
app.use('/api/v1/ventas', ventasRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

export default app;
