-- Datos iniciales (semilla) NORMALIZADOS + VARIADOS
TRUNCATE TABLE movimientos_inventario, venta_items, ventas, perfiles_usuario, usuarios, productos, categorias RESTART IDENTITY CASCADE;

-- 1) Categorias (6)
INSERT INTO categorias (nombre) VALUES
  ('Cigarrillos'),('Bebidas'),('Dulces'),('Abarrotes'),('Licores'),('Otros');

-- 2) Productos (18) con FK a categorias
INSERT INTO productos (codigo, nombre, categoria_id, precio, stock) VALUES
  ('CIG-001','Pielroja x20',(SELECT id FROM categorias WHERE nombre='Cigarrillos'),9500,300),
  ('CIG-002','Marlboro Rojo x20',(SELECT id FROM categorias WHERE nombre='Cigarrillos'),14500,300),
  ('CIG-003','Lucky Strike x20',(SELECT id FROM categorias WHERE nombre='Cigarrillos'),12000,300),
  ('BEB-001','Pony Malta 330ml',(SELECT id FROM categorias WHERE nombre='Bebidas'),3500,300),
  ('BEB-002','Coca-Cola 400ml',(SELECT id FROM categorias WHERE nombre='Bebidas'),4000,300),
  ('BEB-003','Agua Cristal 600ml',(SELECT id FROM categorias WHERE nombre='Bebidas'),2500,300),
  ('BEB-004','Cerveza Poker 330ml',(SELECT id FROM categorias WHERE nombre='Bebidas'),4500,300),
  ('DUL-001','Chocorramo',(SELECT id FROM categorias WHERE nombre='Dulces'),3500,300),
  ('DUL-002','Galletas Festival',(SELECT id FROM categorias WHERE nombre='Dulces'),2800,300),
  ('DUL-003','Chocolatina Jet',(SELECT id FROM categorias WHERE nombre='Dulces'),2000,300),
  ('ABA-001','Papas Margarita 105g',(SELECT id FROM categorias WHERE nombre='Abarrotes'),6500,300),
  ('ABA-002','Arroz Diana 1kg',(SELECT id FROM categorias WHERE nombre='Abarrotes'),4200,300),
  ('ABA-003','Aceite Premier 1L',(SELECT id FROM categorias WHERE nombre='Abarrotes'),18000,300),
  ('LIC-001','Aguardiente Antioqueno',(SELECT id FROM categorias WHERE nombre='Licores'),45000,300),
  ('LIC-002','Ron Medellin 750ml',(SELECT id FROM categorias WHERE nombre='Licores'),62000,300),
  ('OTR-001','Encendedor Bic',(SELECT id FROM categorias WHERE nombre='Otros'),3000,300),
  ('OTR-002','Fosforos',(SELECT id FROM categorias WHERE nombre='Otros'),1200,300),
  ('OTR-003','Bolsa plastica',(SELECT id FROM categorias WHERE nombre='Otros'),500,300)
ON CONFLICT (codigo) DO NOTHING;

-- 3) Usuarios (3)
INSERT INTO usuarios (username, password_hash, nombre, rol) VALUES
  ('admin','$2b$10$p0stYcRqfM3bL6FQqvtwfuCNvNL6Nk2BJGBj3.U6mlinKzGMC5EPe','Administrador Caja','admin'),
  ('cajero1','$2b$10$p0stYcRqfM3bL6FQqvtwfuCNvNL6Nk2BJGBj3.U6mlinKzGMC5EPe','Cajero Uno','cajero'),
  ('cajero2','$2b$10$p0stYcRqfM3bL6FQqvtwfuCNvNL6Nk2BJGBj3.U6mlinKzGMC5EPe','Cajero Dos','cajero');

-- 3.1) Perfiles (PK=FK)
INSERT INTO perfiles_usuario (usuario_id, telefono, direccion, documento) VALUES
  (1,'3001234567','Calle 1 #2-3','1234567890'),
  (2,'3109876543','Carrera 5 #10-20','9876543210'),
  (3,'3205554433','Avenida 80 #45-12','5566778899');

-- 4) Ventas (40) variadas
INSERT INTO ventas (fecha, cliente, documento, medio_pago, subtotal, descuento, total, usuario_id) VALUES
  ('2026-09-07 09:15:00','Maria Gomez','1023456789','Efectivo',38000,0,38000,1),
  ('2026-09-07 14:30:00','Carlos Ruiz','987654321','Nequi',27500,5,26125,2),
  ('2026-09-09 11:00:00','Ana Torres','556677889','Tarjeta',45000,0,45000,1),
  ('2026-09-10 16:20:00','Luis Perez','1122334455','Efectivo',32000,0,32000,3),
  ('2026-09-14 10:20:00','Sofia Diaz','2233445566','Daviplata',51000,10,45900,1),
  ('2026-09-14 16:45:00','Pedro Leon','3344556677','Efectivo',19500,0,19500,2),
  ('2026-09-16 09:05:00','Laura Vega','4455667788','Tarjeta',62000,0,62000,1),
  ('2026-09-21 12:10:00','Jorge Mora','5566778899','Efectivo',28000,0,28000,3),
  ('2026-09-21 17:30:00','Camila Rios','6677889900','Nequi',35500,5,33725,1),
  ('2026-09-23 10:00:00','Andres Gil','7788990011','Efectivo',41000,0,41000,2),
  ('2026-09-28 09:40:00','Valeria Cruz','8899001122','Tarjeta',53000,0,53000,1),
  ('2026-09-28 15:15:00','Diego Herrera','9900112233','Efectivo',24500,0,24500,3),
  ('2026-09-30 11:30:00','Paula Rojas','1011121314','Efectivo',47000,0,47000,1),
  ('2026-10-01 09:25:00','Miguel Soto','1516171819','Nequi',39500,5,37525,2),
  ('2026-10-02 14:50:00','Natalia Pena','2021222324','Tarjeta',58000,0,58000,1),
  ('2026-10-05 10:10:00','Ricardo Luna','2526272829','Efectivo',31500,0,31500,3),
  ('2026-10-05 16:20:00','Gabriela Paz','3031323334','Daviplata',44000,10,39600,1),
  ('2026-10-07 11:45:00','Felipe Castro','3536373839','Efectivo',26000,0,26000,2),
  ('2026-10-09 09:50:00','Daniela Vargas','4041424344','Tarjeta',65000,0,65000,1),
  ('2026-10-09 15:30:00','Santiago Mejia','4546474849','Efectivo',34000,0,34000,3),
  ('2026-10-12 10:25:00','Camilo Reyes','5051525354','Nequi',42500,5,40375,1),
  ('2026-10-12 14:40:00','Isabella Mora','5556575859','Efectivo',49000,0,49000,2),
  ('2026-10-14 09:10:00','Nicolas Bravo','6061626364','Tarjeta',56000,0,56000,1),
  ('2026-10-14 11:15:00','Alejandra Silva','6566676869','Efectivo',30000,0,30000,3),
  ('2026-10-16 10:00:00','Mateo Herrera','7071727374','Efectivo',22000,0,22000,1),
  ('2026-10-19 09:30:00','Lucia Ramirez','7576777879','Tarjeta',67000,0,67000,2),
  ('2026-10-19 14:15:00','Sebastian Castro','8081828384','Nequi',38000,5,36100,1),
  ('2026-10-21 10:45:00','Valentina Ortiz','8586878889','Efectivo',43000,0,43000,3),
  ('2026-10-23 09:20:00','Juan David Lopez','9091929394','Daviplata',52000,10,46800,1),
  ('2026-10-26 10:10:00','Sara Jimenez','9596979899','Tarjeta',61000,0,61000,2),
  ('2026-10-26 15:30:00','Andres Felipe','1001011020','Efectivo',29000,0,29000,1),
  ('2026-10-28 09:00:00','Carolina Mejia','1112131415','Efectivo',37000,0,37000,3),
  ('2026-10-29 11:25:00','Felipe Gomez','1617181920','Nequi',44500,5,42275,1),
  ('2026-10-30 14:00:00','Daniela Rios','2122232425','Tarjeta',59000,0,59000,2),
  ('2026-11-02 09:15:00','Camilo Torres','2627282930','Efectivo',33000,0,33000,1),
  ('2026-11-02 12:40:00','Maria Jose','3132333435','Efectivo',27500,0,27500,3),
  ('2026-11-02 15:10:00','Carlos Andres','3637383940','Tarjeta',48000,0,48000,1),
  ('2026-11-02 17:30:00','Ana Maria','4142434445','Nequi',36000,5,34200,2),
  ('2026-11-02 19:00:00','Luis Fernando','4647484950','Efectivo',25000,0,25000,1),
  ('2026-11-02 20:15:00','Sofia Alejandra','5152535455','Daviplata',41000,10,36900,3);

-- 5) Items (PK compuesta venta_id+codigo) variados
INSERT INTO venta_items (venta_id, codigo, cantidad, precio_unitario, subtotal) VALUES
  (1,'CIG-001',2,9500,19000),(1,'BEB-001',4,3500,14000),(1,'DUL-001',1,3500,3500),
  (2,'BEB-002',5,4000,20000),(2,'DUL-001',2,3500,7000),
  (3,'CIG-002',2,14500,29000),(3,'ABA-001',2,6500,13000),
  (4,'CIG-001',1,9500,9500),(4,'BEB-003',3,2500,7500),(4,'DUL-003',4,2000,8000),
  (5,'CIG-002',1,14500,14500),(5,'ABA-001',3,6500,19500),(5,'DUL-001',5,3500,17500),
  (6,'BEB-001',4,3500,14000),(6,'DUL-002',2,2800,5600),
  (7,'CIG-003',3,12000,36000),(7,'CIG-001',1,9500,9500),(7,'BEB-004',2,4500,9000),
  (8,'ABA-002',2,4200,8400),(8,'BEB-001',3,3500,10500),
  (9,'CIG-001',1,9500,9500),(9,'DUL-001',3,3500,10500),(9,'BEB-002',4,4000,16000),
  (10,'CIG-002',2,14500,29000),(10,'BEB-001',2,3500,7000),
  (11,'CIG-001',2,9500,19000),(11,'ABA-001',3,6500,19500),(11,'DUL-001',3,3500,10500),
  (12,'BEB-002',4,4000,16000),(12,'DUL-001',2,3500,7000),
  (13,'CIG-002',2,14500,29000),(13,'BEB-001',4,3500,14000),
  (14,'CIG-001',1,9500,9500),(14,'BEB-002',5,4000,20000),(14,'DUL-001',2,3500,7000),
  (15,'CIG-002',3,14500,43500),(15,'ABA-001',2,6500,13000),
  (16,'BEB-001',5,3500,17500),(16,'DUL-001',4,3500,14000),
  (17,'CIG-001',2,9500,19000),(17,'CIG-002',1,14500,14500),(17,'BEB-002',3,4000,12000),
  (18,'ABA-001',2,6500,13000),(18,'BEB-001',2,3500,7000),(18,'DUL-001',1,3500,3500),
  (19,'CIG-002',3,14500,43500),(19,'BEB-002',4,4000,16000),
  (20,'CIG-001',2,9500,19000),(20,'DUL-001',3,3500,10500),(20,'BEB-001',1,3500,3500),
  (21,'CIG-002',1,14500,14500),(21,'ABA-001',2,6500,13000),(21,'BEB-002',3,4000,12000),
  (22,'CIG-001',3,9500,28500),(22,'BEB-001',4,3500,14000),(22,'DUL-001',2,3500,7000),
  (23,'CIG-002',2,14500,29000),(23,'BEB-002',5,4000,20000),(23,'ABA-001',1,6500,6500),
  (24,'CIG-001',2,9500,19000),(24,'DUL-001',3,3500,10500),
  (25,'LIC-001',1,45000,45000),(25,'OTR-001',2,3000,6000),
  (26,'CIG-003',2,12000,24000),(26,'BEB-004',3,4500,13500),(26,'DUL-002',2,2800,5600),
  (27,'ABA-002',3,4200,12600),(27,'ABA-003',1,18000,18000),
  (28,'LIC-002',1,62000,62000),(28,'OTR-002',5,1200,6000),
  (29,'CIG-001',1,9500,9500),(29,'BEB-003',4,2500,10000),(29,'DUL-003',3,2000,6000),
  (30,'BEB-001',6,3500,21000),(30,'DUL-002',3,2800,8400),
  (31,'CIG-002',1,14500,14500),(31,'ABA-001',2,6500,13000),
  (32,'CIG-003',2,12000,24000),(32,'BEB-002',3,4000,12000),
  (33,'DUL-001',4,3500,14000),(33,'OTR-003',10,500,5000),
  (34,'LIC-001',1,45000,45000),(34,'BEB-004',2,4500,9000),
  (35,'CIG-001',2,9500,19000),(35,'BEB-001',3,3500,10500),
  (36,'CIG-002',1,14500,14500),(36,'DUL-002',2,2800,5600),
  (37,'ABA-001',2,6500,13000),(37,'BEB-003',3,2500,7500),
  (38,'CIG-003',1,12000,12000),(38,'DUL-001',2,3500,7000),
  (39,'BEB-002',4,4000,16000),(39,'OTR-001',1,3000,3000),
  (40,'CIG-001',2,9500,19000),(40,'DUL-003',3,2000,6000);

-- (movimientos de inventario se generan automaticamente por el trigger)
