const Pedido = require('../../domain/entities/Pedido');

function crearPedidoUseCases({ pedidoRepository, productoRepository, usuarioRepository }) {
  return {
    async crear({ id_usuario, detalles }) {
      const usuario = await usuarioRepository.buscarPorId(id_usuario);
      if (!usuario) throw new Error('Usuario no encontrado');

      // Regla de negocio: comprobar stock y armar detalles con precio actual
      const detallesConPrecio = [];
      for (const it of detalles) {
        const producto = await productoRepository.buscarPorId(it.id_producto);
        if (!producto) throw new Error(`Producto ${it.id_producto} no encontrado`);
        if (!producto.tieneStockDisponible(it.cantidad)) {
          throw new Error(`Stock insuficiente para "${producto.nombre}"`);
        }
        detallesConPrecio.push({
          id_producto: producto.id_producto,
          cantidad: it.cantidad,
          precio_unitario: producto.precio,
        });
      }

      const pedido = new Pedido({ id_usuario, detalles: detallesConPrecio });
      const creado = await pedidoRepository.crear(pedido);

      // Descontar stock tras confirmar la creación del pedido
      for (const it of detallesConPrecio) {
        const producto = await productoRepository.buscarPorId(it.id_producto);
        producto.descontarStock(it.cantidad);
        await productoRepository.actualizar(producto.id_producto, { stock: producto.stock });
      }

      return creado;
    },

    async obtener(id) {
      const pedido = await pedidoRepository.buscarPorId(id);
      if (!pedido) throw new Error('Pedido no encontrado');
      return pedido;
    },

    async listar() {
      return pedidoRepository.listar();
    },

    async actualizarEstado(id, estado) {
      return pedidoRepository.actualizar(id, { estado });
    },

    async eliminar(id) {
      return pedidoRepository.eliminar(id);
    },
  };
}

module.exports = crearPedidoUseCases;
