const Producto = require('../../domain/entities/Producto');

function crearProductoUseCases({ productoRepository }) {
  return {
    async crear({ nombre, descripcion, precio, stock }) {
      const producto = new Producto({ nombre, descripcion, precio, stock });
      return productoRepository.crear(producto);
    },

    async obtener(id) {
      const producto = await productoRepository.buscarPorId(id);
      if (!producto) throw new Error('Producto no encontrado');
      return producto;
    },

    async listar() {
      return productoRepository.listar();
    },

    async actualizar(id, datos) {
      return productoRepository.actualizar(id, datos);
    },

    async eliminar(id) {
      return productoRepository.eliminar(id);
    },
  };
}

module.exports = crearProductoUseCases;
