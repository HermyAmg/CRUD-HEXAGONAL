const { Router } = require('express');

function usuarioController(usuarioUseCases) {
  const router = Router();

  router.post('/registro', async (req, res) => {
    try {
      const usuario = await usuarioUseCases.registrar(req.body);
      res.status(201).json(usuario);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const usuario = await usuarioUseCases.login(req.body);
      res.json(usuario);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  });

  router.get('/', async (_req, res) => {
    try {
      res.json(await usuarioUseCases.listar());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      res.json(await usuarioUseCases.obtener(req.params.id));
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      res.json(await usuarioUseCases.actualizar(req.params.id, req.body));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const ok = await usuarioUseCases.eliminar(req.params.id);
      res.status(ok ? 204 : 404).end();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}

module.exports = usuarioController;
