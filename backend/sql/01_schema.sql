-- Esquema NORMALIZADO (3FN) para caja registradora (PostgreSQL 18)

-- 1) Categorias
CREATE TABLE IF NOT EXISTS categorias (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL
);

-- 2) Productos (FK a categorias)
CREATE TABLE IF NOT EXISTS productos (
  codigo        VARCHAR(50) PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  categoria_id  INTEGER NOT NULL REFERENCES categorias(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  precio        NUMERIC(12,2) NOT NULL CHECK (precio >= 0),
  stock         INTEGER NOT NULL CHECK (stock >= 0)
);

-- 3) Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre        VARCHAR(100) NOT NULL,
  rol           VARCHAR(30) NOT NULL DEFAULT 'cajero',
  creado_en     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3.1) Perfil (PK = FK)
CREATE TABLE IF NOT EXISTS perfiles_usuario (
  usuario_id INTEGER PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  telefono   VARCHAR(20),
  direccion  VARCHAR(150),
  documento  VARCHAR(20)
);

-- 4) Ventas
CREATE TABLE IF NOT EXISTS ventas (
  id            SERIAL PRIMARY KEY,
  fecha         TIMESTAMP NOT NULL DEFAULT NOW(),
  cliente       VARCHAR(100),
  documento     VARCHAR(20),
  medio_pago    VARCHAR(20) NOT NULL,
  subtotal      NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
  descuento     NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (descuento BETWEEN 0 AND 100),
  total         NUMERIC(12,2) NOT NULL CHECK (total >= 0),
  usuario_id    INTEGER REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 5) Detalle (PK compuesta = 2 FK)
CREATE TABLE IF NOT EXISTS venta_items (
  venta_id         INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  codigo           VARCHAR(50) NOT NULL REFERENCES productos(codigo) ON UPDATE CASCADE ON DELETE RESTRICT,
  cantidad         INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario  NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal         NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
  PRIMARY KEY (venta_id, codigo)
);

-- 6) Movimientos de inventario
CREATE TABLE IF NOT EXISTS movimientos_inventario (
  id          SERIAL PRIMARY KEY,
  codigo      VARCHAR(50) NOT NULL REFERENCES productos(codigo) ON UPDATE CASCADE ON DELETE CASCADE,
  tipo        VARCHAR(10) NOT NULL CHECK (tipo IN ('ENTRADA','SALIDA')),
  cantidad    INTEGER NOT NULL CHECK (cantidad > 0),
  motivo      VARCHAR(50) NOT NULL,
  fecha       TIMESTAMP NOT NULL DEFAULT NOW(),
  venta_id    INTEGER REFERENCES ventas(id) ON DELETE SET NULL
);

-- 7) Trigger: actualiza stock y registra movimiento al insertar item de venta
CREATE OR REPLACE FUNCTION fn_actualizar_stock_venta()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE productos
  SET stock = stock - NEW.cantidad
  WHERE codigo = NEW.codigo;

  IF (SELECT stock FROM productos WHERE codigo = NEW.codigo) < 0 THEN
    RAISE EXCEPTION 'Stock insuficiente para el producto %', NEW.codigo;
  END IF;

  INSERT INTO movimientos_inventario (codigo, tipo, cantidad, motivo, venta_id)
  VALUES (NEW.codigo, 'SALIDA', NEW.cantidad, 'VENTA', NEW.venta_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_venta_items_stock ON venta_items;
CREATE TRIGGER trg_venta_items_stock
AFTER INSERT ON venta_items
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_stock_venta();

-- 8) Vistas para reportes
CREATE OR REPLACE VIEW v_resumen_ventas_semanal AS
SELECT
  date_trunc('week', fecha) AS semana_inicio,
  to_char(date_trunc('week', fecha), 'IYYY-"W"IW') AS semana,
  COUNT(*)::int AS cantidad_ventas,
  COALESCE(SUM(total), 0)::numeric AS total
FROM ventas
GROUP BY date_trunc('week', fecha)
ORDER BY date_trunc('week', fecha);

CREATE OR REPLACE VIEW v_resumen_ventas_mensual AS
SELECT
  date_trunc('month', fecha) AS mes_inicio,
  to_char(date_trunc('month', fecha), 'YYYY-MM') AS mes,
  COUNT(*)::int AS cantidad_ventas,
  COALESCE(SUM(total), 0)::numeric AS total
FROM ventas
GROUP BY date_trunc('month', fecha)
ORDER BY date_trunc('month', fecha);
