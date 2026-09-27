const Usuario = require('../../domain/entities/Usuario');

function filaAUsuario(fila) {
  if (!fila) return null;
  return new Usuario({
    id_usuario: fila.id_usuario,
    nombre: fila.nombre,
    correo: fila.correo,
    password_hash: fila.password_hash,
    rol: fila.rol,
  });
}

class PgUsuarioRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async crear(usuario) {
    const { rows } = await this.pool.query(
      `INSERT INTO usuarios (nombre, correo, password_hash, rol)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [usuario.nombre, usuario.correo, usuario.password_hash, usuario.rol]
    );
    return filaAUsuario(rows[0]);
  }

  async buscarPorId(id) {
    const { rows } = await this.pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id]);
    return filaAUsuario(rows[0]);
  }

  async buscarPorCorreo(correo) {
    const { rows } = await this.pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    return filaAUsuario(rows[0]);
  }

  async listar() {
    const { rows } = await this.pool.query('SELECT * FROM usuarios ORDER BY id_usuario');
    return rows.map(filaAUsuario);
  }

  async actualizar(id, datos) {
    const campos = [];
    const valores = [];
    let i = 1;
    if (datos.nombre) { campos.push(`nombre = $${i++}`); valores.push(datos.nombre); }
    if (datos.correo) { campos.push(`correo = $${i++}`); valores.push(datos.correo); }
    if (datos.password_hash) { campos.push(`password_hash = $${i++}`); valores.push(datos.password_hash); }
    if (datos.rol) { campos.push(`rol = $${i++}`); valores.push(datos.rol); }
    valores.push(id);

    const { rows } = await this.pool.query(
      `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = $${i} RETURNING *`,
      valores
    );
    return filaAUsuario(rows[0]);
  }

  async eliminar(id) {
    const { rowCount } = await this.pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
    return rowCount > 0;
  }
}

module.exports = PgUsuarioRepository;
