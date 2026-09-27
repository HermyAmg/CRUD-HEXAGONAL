class Producto {
  constructor({ id_producto, nombre, descripcion = '', precio, stock }) {
    if (!nombre || nombre.trim().length === 0) {
      throw new Error('El nombre del producto es obligatorio');
    }
    if (typeof precio !== 'number' || precio <= 0) {
      throw new Error('El precio debe ser un número mayor a 0');
    }
    if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
      throw new Error('El stock debe ser un entero mayor o igual a 0');
    }

    this.id_producto = id_producto;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.stock = stock;
  }

  // Regla de negocio: comprobación de stock disponible al ordenar
  tieneStockDisponible(cantidadSolicitada) {
    return this.stock >= cantidadSolicitada;
  }

  descontarStock(cantidad) {
    if (!this.tieneStockDisponible(cantidad)) {
      throw new Error(`Stock insuficiente para el producto "${this.nombre}"`);
    }
    this.stock -= cantidad;
    return this.stock;
  }
}

module.exports = Producto;
