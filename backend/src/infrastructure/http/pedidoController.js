const { Router } = require('express');

function pedidoController(pedidoUseCases) {
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      res.status(201).json(await pedidoUseCases.crear(req.body));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/', async (_req, res) => {
    try {
      res.json(await pedidoUseCases.listar());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      res.json(await pedidoUseCases.obtener(req.params.id));
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      res.json(await pedidoUseCases.actualizarEstado(req.params.id, req.body.estado));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const ok = await pedidoUseCases.eliminar(req.params.id);
      res.status(ok ? 204 : 404).end();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}

module.exports = pedidoController;
