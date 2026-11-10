TRUNCATE TABLE venta_items, ventas, usuarios, productos RESTART IDENTITY CASCADE;

INSERT INTO productos (codigo, nombre, categoria, precio, stock) VALUES
  ('CIG-001','Pielroja x20','Cigarrillos',9500,200),
  ('CIG-002','Marlboro Rojo x20','Cigarrillos',14500,200),
  ('CIG-003','Lucky Strike x20','Cigarrillos',12000,200),
  ('BEB-001','Pony Malta 330ml','Bebidas',3500,200),
  ('BEB-002','Coca-Cola 400ml','Bebidas',4000,200),
  ('BEB-003','Agua Cristal 600ml','Bebidas',2500,200),
  ('DUL-001','Chocorramo','Dulces',3500,200),
  ('DUL-002','Galletas Festival','Dulces',2800,200),
  ('ABA-001','Papas Margarita 105g','Abarrotes',6500,200),
  ('ABA-002','Arroz Diana 1kg','Abarrotes',4200,200),
  ('LIC-001','Aguardiente Antioqueno','Licores',45000,200),
  ('OTR-001','Encendedor Bic','Otros',3000,200)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO usuarios (username, password, nombre, rol) VALUES
  ('admin','admin123','Administrador Caja','admin'),
  ('cajero1','cajero123','Cajero Uno','cajero');

INSERT INTO ventas (fecha, cliente, documento, medio_pago, subtotal, descuento, total) VALUES
  ('2026-11-02 09:15:00','Maria Gomez','1023456789','Efectivo',38000,0,38000),
  ('2026-11-02 14:30:00','Carlos Ruiz','987654321','Nequi',27500,5,26125),
  ('2026-11-02 11:00:00','Ana Torres','556677889','Tarjeta',45000,0,45000),
  ('2026-10-30 10:20:00','Luis Perez','1122334455','Efectivo',32000,0,32000),
  ('2026-10-28 16:45:00','Sofia Diaz','2233445566','Daviplata',51000,10,45900);

INSERT INTO venta_items (venta_id, codigo, cantidad, precio_unitario, subtotal) VALUES
  (1,'CIG-001',2,9500,19000),(1,'BEB-001',4,3500,14000),(1,'DUL-001',1,3500,3500),
  (2,'BEB-002',5,4000,20000),(2,'DUL-001',2,3500,7000),
  (3,'CIG-002',2,14500,29000),(3,'ABA-001',2,6500,13000),
  (4,'CIG-001',1,9500,9500),(4,'BEB-003',3,2500,7500),
  (5,'CIG-002',1,14500,14500),(5,'ABA-001',3,6500,19500);
