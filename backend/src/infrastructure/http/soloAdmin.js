/**
 * Middleware: solo deja pasar a usuarios con rol "admin".
 * (Autenticación simplificada para el curso: el frontend manda el id del
 * usuario en el header x-usuario-id; en producción se usaría un JWT.)
 */
function soloAdmin(usuarioUseCases) {
  return async (req, res, next) => {
    const id = req.header('x-usuario-id');
    if (!id) return res.status(401).json({ error: 'Falta identificar al usuario' });
    try {
      const usuario = await usuarioUseCases.obtener(id);
      if (usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso exclusivo para administradores' });
      }
      next();
    } catch (err) {
      res.status(401).json({ error: 'Usuario no válido' });
    }
  };
}
module.exports = soloAdmin;
