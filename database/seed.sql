-- Datos de ejemplo para el dashboard (correr UNA sola vez)
INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Laptop Pro 14', 'Laptop 16GB RAM, 512GB SSD', 18999.00, 80),
('Smartphone X', 'Pantalla AMOLED 128GB', 8499.00, 120),
('Audífonos Bluetooth', 'Cancelación de ruido', 1299.00, 200),
('Smartwatch Fit', 'Monitor de actividad', 2199.00, 150),
('Teclado Mecánico', 'Switches rojos RGB', 999.00, 90),
('Mouse Inalámbrico', 'Ergonómico 2400 DPI', 449.00, 300),
('Monitor 27"', 'IPS 144Hz', 5499.00, 60),
('Cámara Web HD', '1080p con micrófono', 799.00, 110),
('Bocina Portátil', 'Resistente al agua', 1099.00, 140),
('Tablet 10"', '64GB WiFi', 4299.00, 70);

INSERT INTO usuarios (nombre, correo, password_hash, rol) VALUES
('Ana López', 'ana@demo.com', 'SEED_NO_LOGIN', 'cliente'),
('Carlos Ruiz', 'carlos@demo.com', 'SEED_NO_LOGIN', 'cliente'),
('María Pérez', 'maria@demo.com', 'SEED_NO_LOGIN', 'cliente'),
('Luis Gómez', 'luis@demo.com', 'SEED_NO_LOGIN', 'cliente'),
('Sofía Torres', 'sofia@demo.com', 'SEED_NO_LOGIN', 'cliente'),
('Jorge Díaz', 'jorge@demo.com', 'SEED_NO_LOGIN', 'cliente'),
('Elena Cruz', 'elena@demo.com', 'SEED_NO_LOGIN', 'cliente'),
('Pablo Reyes', 'pablo@demo.com', 'SEED_NO_LOGIN', 'cliente')
ON CONFLICT (correo) DO NOTHING;

DO $$
DECLARE
  v_pedido INT; v_user INT; v_fecha TIMESTAMP; v_estado TEXT;
  v_total NUMERIC; n_items INT; v_prod RECORD; v_cant INT; r DOUBLE PRECISION;
BEGIN
  FOR i IN 1..160 LOOP
    SELECT id_usuario INTO v_user FROM usuarios WHERE rol = 'cliente' ORDER BY random() LIMIT 1;
    v_fecha := NOW() - (random() * 60) * INTERVAL '1 day' - (random() * 12) * INTERVAL '1 hour';
    r := random();
    v_estado := CASE WHEN r < 0.15 THEN 'pendiente'
                     WHEN r < 0.55 THEN 'pagado'
                     WHEN r < 0.90 THEN 'enviado'
                     ELSE 'cancelado' END;
    INSERT INTO pedidos (id_usuario, fecha, estado, total)
    VALUES (v_user, v_fecha, v_estado, 0) RETURNING id_pedido INTO v_pedido;
    v_total := 0;
    n_items := 1 + floor(random() * 3)::int;
    FOR v_prod IN
      SELECT id_producto, precio FROM productos
      ORDER BY power(random(), 1 + (id_producto % 5)) LIMIT n_items
    LOOP
      v_cant := 1 + floor(random() * 3)::int;
      INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
      VALUES (v_pedido, v_prod.id_producto, v_cant, v_prod.precio);
      v_total := v_total + v_cant * v_prod.precio;
    END LOOP;
    UPDATE pedidos SET total = v_total WHERE id_pedido = v_pedido;
  END LOOP;
END $$;
