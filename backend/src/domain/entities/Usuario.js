class Usuario {
  constructor({ id_usuario, nombre, correo, password_hash, rol = 'cliente' }) {
    if (!nombre || nombre.trim().length < 3) {
      throw new Error('El nombre debe tener al menos 3 caracteres');
    }
    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      throw new Error('Correo inválido');
    }
    if (!['cliente', 'admin'].includes(rol)) {
      throw new Error('Rol inválido');
    }

    this.id_usuario = id_usuario;
    this.nombre = nombre;
    this.correo = correo;
    this.password_hash = password_hash;
    this.rol = rol;
  }

  // Nunca se expone la contraseña
  toPublicJSON() {
    return {
      id_usuario: this.id_usuario,
      nombre: this.nombre,
      correo: this.correo,
      rol: this.rol,
    };
  }

  static validarPassword(passwordPlano) {
    if (!passwordPlano || passwordPlano.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[0-9]/.test(passwordPlano) || !/[a-zA-Z]/.test(passwordPlano)) {
      throw new Error('La contraseña debe combinar letras y números');
    }
    return true;
  }
}

module.exports = Usuario;
