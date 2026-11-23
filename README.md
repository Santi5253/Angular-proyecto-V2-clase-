# mi-app-v2

Mini sistema de **caja registradora** (punto de venta) con frontend en Angular y backend en Node/Express + PostgreSQL.

## Estructura

```
mi-app-v2/
├── backend/   # API REST (Express + TypeScript + pg)
└── frontend/  # App Angular (Material, Chart.js)
```

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- npm

## Configuración

1. Base de datos:

```bash
cd backend
cp .env.example .env
# edita .env con tus credenciales
npm run db:init
```

2. Backend:

```bash
cd backend
npm install
npm run dev   # http://localhost:3000
```

3. Frontend:

```bash
cd frontend
npm install
npm start     # http://localhost:4200
```

## Endpoints principales

- `GET /api/v1/health`
- `/api/v1/auth`
- `/api/v1/productos`
- `/api/v1/ventas`
- `/api/v1/dashboard`

## Funcionalidades

- Login de usuarios
- Inventario de productos
- Facturación / ventas
- Historial de ventas
- Dashboard con reportes
