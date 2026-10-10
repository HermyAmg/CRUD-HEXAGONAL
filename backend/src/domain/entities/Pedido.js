class Pedido {
  constructor({ id_pedido, id_usuario, detalles = [], estado = 'pendiente', fecha = new Date() }) {
    if (!id_usuario) {
      throw new Error('El pedido requiere un id_usuario');
    }
    if (!Array.isArray(detalles) || detalles.length === 0) {
      throw new Error('El pedido debe contener al menos un producto');
    }
    detalles.forEach((it) => {
      if (!it.id_producto || !it.cantidad || it.cantidad <= 0) {
        throw new Error('Cada detalle requiere id_producto y cantidad > 0');
      }
    });
    if (!['pendiente', 'pagado', 'enviado', 'cancelado'].includes(estado)) {
      throw new Error('Estado de pedido inválido');
    }

    this.id_pedido = id_pedido;
    this.id_usuario = id_usuario;
    this.detalles = detalles;
    this.estado = estado;
    this.fecha = fecha;
    this.total = this.calcularTotal();
  }

  // Regla de negocio: cálculo del monto total
  calcularTotal() {
    return Number(
      this.detalles
        .reduce((acc, it) => acc + it.cantidad * it.precio_unitario, 0)
        .toFixed(2)
    );
  }
}

module.exports = Pedido;
