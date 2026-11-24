# Caja Registradora V2 (Cigarrería)

Mini sistema de punto de venta: **frontend en Angular** y **backend en Node/Express + TypeScript + PostgreSQL**, desplegados en **Railway**.

- Frontend: https://angular-proyecto-v2-clase-frontend-production.up.railway.app
- Backend: https://angular-proyecto-v2-clase-backend-production.up.railway.app/api/v1/health

## Estructura

```
Angular-proyecto-V2-clase-/
├── backend/                 API REST
│   ├── sql/                 schema.sql (tablas) y seed.sql (datos iniciales)
│   ├── scripts/init-db.js   crea usuario y BD en tu PC (solo local)
│   └── src/
│       ├── Config/          conexión a Postgres y creación automática de tablas
│       ├── Controllers/     lógica de cada petición
│       ├── Models/          consultas SQL
│       ├── Routes/          URLs de la API
│       ├── app.ts           arma Express (CORS, JSON, rutas)
│       └── serve.ts         punto de arranque
└── frontend/                App Angular
    ├── public/img/          logo e imágenes
    └── src/
        ├── environments/    URL del backend (local o Railway)
        └── app/
            ├── Components/  piezas reutilizables (menu, tabla)
            ├── Services/    llamadas HTTP al backend
            └── Views/       pantallas (login, inventario, factura, historial, dashboard)
```

## Correr en local

```bash
# Backend
cd backend
cp .env.example .env      # edita tus credenciales
npm install
npm run db:init           # solo la primera vez
npm run dev               # http://localhost:3000

# Frontend (otra terminal)
cd frontend
npm install
npm run dev               # http://localhost:4200
```

## Scripts

| Carpeta  | Script            | Qué hace                                         |
|----------|-------------------|--------------------------------------------------|
| backend  | `npm run dev`     | Levanta la API con tsx (sin compilar)            |
| backend  | `npm run build`   | Compila TypeScript a `dist/`                     |
| backend  | `npm start`       | Ejecuta la versión compilada (la usa Railway)    |
| backend  | `npm run db:init` | Crea usuario, base y tablas en tu Postgres local |
| frontend | `npm run dev`     | Servidor de desarrollo de Angular                |
| frontend | `npm run build`   | Genera la versión de producción                  |
| frontend | `npm start`       | Sirve la versión de producción (la usa Railway)  |

## Railway

| Servicio | Root Directory | Variables                                   |
|----------|----------------|---------------------------------------------|
| backend  | `/backend`     | `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `FRONT_URL` |
| frontend | `/frontend`    | (ninguna; Railway pone `PORT`)              |
| Postgres | —              | lo crea Railway                             |

## Endpoints

`GET /api/v1/health` · `/api/v1/auth` · `/api/v1/productos` · `/api/v1/ventas` · `/api/v1/dashboard`
