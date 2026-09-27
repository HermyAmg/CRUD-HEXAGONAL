const Pedido = require('../../domain/entities/Pedido');

class PgPedidoRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async _cargarDetalles(id_pedido) {
    const { rows } = await this.pool.query(
      'SELECT id_producto, cantidad, precio_unitario FROM detalle_pedido WHERE id_pedido = $1',
      [id_pedido]
    );
    return rows.map((r) => ({
      id_producto: r.id_producto,
      cantidad: r.cantidad,
      precio_unitario: Number(r.precio_unitario),
    }));
  }

  async _filaAPedido(fila) {
    if (!fila) return null;
    const detalles = await this._cargarDetalles(fila.id_pedido);
    return new Pedido({
      id_pedido: fila.id_pedido,
      id_usuario: fila.id_usuario,
      detalles,
      estado: fila.estado,
      fecha: fila.fecha,
    });
  }

  async crear(pedido) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(
        `INSERT INTO pedidos (id_usuario, estado, total) VALUES ($1, $2, $3) RETURNING *`,
        [pedido.id_usuario, pedido.estado, pedido.total]
      );
      const id_pedido = rows[0].id_pedido;

      for (const it of pedido.detalles) {
        await client.query(
          `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
           VALUES ($1, $2, $3, $4)`,
          [id_pedido, it.id_producto, it.cantidad, it.precio_unitario]
        );
      }

      await client.query('COMMIT');
      return this._filaAPedido(rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async buscarPorId(id) {
    const { rows } = await this.pool.query('SELECT * FROM pedidos WHERE id_pedido = $1', [id]);
    return this._filaAPedido(rows[0]);
  }

  async listar() {
    const { rows } = await this.pool.query('SELECT * FROM pedidos ORDER BY id_pedido');
    return Promise.all(rows.map((r) => this._filaAPedido(r)));
  }

  async actualizar(id, datos) {
    const campos = [];
    const valores = [];
    let i = 1;
    if (datos.estado) { campos.push(`estado = $${i++}`); valores.push(datos.estado); }
    if (datos.total !== undefined) { campos.push(`total = $${i++}`); valores.push(datos.total); }
    valores.push(id);

    const { rows } = await this.pool.query(
      `UPDATE pedidos SET ${campos.join(', ')} WHERE id_pedido = $${i} RETURNING *`,
      valores
    );
    return this._filaAPedido(rows[0]);
  }

  async eliminar(id) {
    const { rowCount } = await this.pool.query('DELETE FROM pedidos WHERE id_pedido = $1', [id]);
    return rowCount > 0;
  }
}

module.exports = PgPedidoRepository;
