const Usuario = require('../../domain/entities/Usuario');

function crearUsuarioUseCases({ usuarioRepository, passwordHasher }) {
  return {
    async registrar({ nombre, correo, password, rol }) {
      Usuario.validarPassword(password);
      const existente = await usuarioRepository.buscarPorCorreo(correo);
      if (existente) throw new Error('El correo ya está registrado');

      const password_hash = await passwordHasher.hash(password);
      const usuario = new Usuario({ nombre, correo, password_hash, rol });
      const creado = await usuarioRepository.crear(usuario);
      return creado.toPublicJSON();
    },

    async login({ correo, password }) {
      const usuario = await usuarioRepository.buscarPorCorreo(correo);
      if (!usuario) throw new Error('Credenciales inválidas');
      const ok = await passwordHasher.comparar(password, usuario.password_hash);
      if (!ok) throw new Error('Credenciales inválidas');
      return usuario.toPublicJSON();
    },

    async obtener(id) {
      const usuario = await usuarioRepository.buscarPorId(id);
      if (!usuario) throw new Error('Usuario no encontrado');
      return usuario.toPublicJSON();
    },

    async listar() {
      const usuarios = await usuarioRepository.listar();
      return usuarios.map((u) => u.toPublicJSON());
    },

    async actualizar(id, datos) {
      if (datos.password) {
        Usuario.validarPassword(datos.password);
        datos.password_hash = await passwordHasher.hash(datos.password);
        delete datos.password;
      }
      const actualizado = await usuarioRepository.actualizar(id, datos);
      return actualizado.toPublicJSON();
    },

    async eliminar(id) {
      return usuarioRepository.eliminar(id);
    },
  };
}

module.exports = crearUsuarioUseCases;
