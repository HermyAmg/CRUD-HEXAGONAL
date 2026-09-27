const Producto = require('../../domain/entities/Producto');

function filaAProducto(fila) {
  if (!fila) return null;
  return new Producto({
    id_producto: fila.id_producto,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    precio: Number(fila.precio),
    stock: fila.stock,
  });
}

class PgProductoRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async crear(producto) {
    const { rows } = await this.pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock) VALUES ($1, $2, $3, $4) RETURNING *`,
      [producto.nombre, producto.descripcion, producto.precio, producto.stock]
    );
    return filaAProducto(rows[0]);
  }

  async buscarPorId(id) {
    const { rows } = await this.pool.query('SELECT * FROM productos WHERE id_producto = $1', [id]);
    return filaAProducto(rows[0]);
  }

  async listar() {
    const { rows } = await this.pool.query('SELECT * FROM productos ORDER BY id_producto');
    return rows.map(filaAProducto);
  }

  async actualizar(id, datos) {
    const campos = [];
    const valores = [];
    let i = 1;
    if (datos.nombre !== undefined) { campos.push(`nombre = $${i++}`); valores.push(datos.nombre); }
    if (datos.descripcion !== undefined) { campos.push(`descripcion = $${i++}`); valores.push(datos.descripcion); }
    if (datos.precio !== undefined) { campos.push(`precio = $${i++}`); valores.push(datos.precio); }
    if (datos.stock !== undefined) { campos.push(`stock = $${i++}`); valores.push(datos.stock); }
    valores.push(id);

    const { rows } = await this.pool.query(
      `UPDATE productos SET ${campos.join(', ')} WHERE id_producto = $${i} RETURNING *`,
      valores
    );
    return filaAProducto(rows[0]);
  }

  async eliminar(id) {
    const { rowCount } = await this.pool.query('DELETE FROM productos WHERE id_producto = $1', [id]);
    return rowCount > 0;
  }
}

module.exports = PgProductoRepository;
