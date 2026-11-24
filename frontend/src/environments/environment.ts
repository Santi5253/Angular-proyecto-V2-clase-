// URL del backend: local cuando la app corre en localhost, Railway en producción
const esLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const environment = {
  apiUrl: esLocal
    ? 'http://localhost:3000/api/v1'
    : 'https://angular-proyecto-v2-clase-backend-production.up.railway.app/api/v1',
};
