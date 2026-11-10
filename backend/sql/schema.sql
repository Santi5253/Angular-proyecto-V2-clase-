CREATE TABLE IF NOT EXISTS productos (
  codigo VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  precio NUMERIC(12,2) NOT NULL CHECK (precio >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  rol VARCHAR(30) NOT NULL DEFAULT 'cajero'
);

CREATE TABLE IF NOT EXISTS ventas (
  id SERIAL PRIMARY KEY,
  fecha TIMESTAMP NOT NULL DEFAULT NOW(),
  cliente VARCHAR(100),
  documento VARCHAR(20),
  medio_pago VARCHAR(20) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  descuento NUMERIC(5,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS venta_items (
  venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  codigo VARCHAR(50) NOT NULL REFERENCES productos(codigo) ON DELETE RESTRICT,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(12,2) NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL,
  PRIMARY KEY (venta_id, codigo)
);

-- Trigger: descuenta stock al insertar item de venta
CREATE OR REPLACE FUNCTION fn_actualizar_stock_venta()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE productos SET stock = stock - NEW.cantidad WHERE codigo = NEW.codigo;
  IF (SELECT stock FROM productos WHERE codigo = NEW.codigo) < 0 THEN
    RAISE EXCEPTION 'Stock insuficiente para %', NEW.codigo;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_venta_items_stock ON venta_items;
CREATE TRIGGER trg_venta_items_stock
AFTER INSERT ON venta_items
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_stock_venta();

-- Vistas para dashboard
CREATE OR REPLACE VIEW v_resumen_ventas_semanal AS
SELECT to_char(date_trunc('week', fecha), 'IYYY-"W"IW') AS semana, COALESCE(SUM(total),0)::numeric AS total, COUNT(*)::int AS cantidad
FROM ventas GROUP BY date_trunc('week', fecha) ORDER BY date_trunc('week', fecha);

CREATE OR REPLACE VIEW v_resumen_ventas_mensual AS
SELECT to_char(date_trunc('month', fecha), 'YYYY-MM') AS mes, COALESCE(SUM(total),0)::numeric AS total, COUNT(*)::int AS cantidad
FROM ventas GROUP BY date_trunc('month', fecha) ORDER BY date_trunc('month', fecha);
