import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { initDatabase } from './Config/init-db';

const PORT = Number(process.env.PORT || 3000);

initDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('API ejecutándose en el puerto ' + PORT);
    });
  })
  .catch((err) => {
    console.error('[db] No se pudo inicializar la base de datos:', err.message);
    process.exit(1);
  });
