const { Router } = require('express');
const soloAdmin = require('./soloAdmin');

function reportesController(analyticsService, usuarioUseCases) {
  const router = Router();
  router.use(soloAdmin(usuarioUseCases));

  const manejar = (fn) => async (req, res) => {
    try {
      res.json(await fn(req.query));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  router.get('/resumen', manejar((q) => analyticsService.resumen(q)));
  router.get('/top-productos', manejar((q) => analyticsService.topProductos(q)));
  router.get('/ingresos', manejar((q) => analyticsService.ingresos(q)));
  router.get('/estados-pedidos', manejar((q) => analyticsService.estadosPedidos(q)));
  router.get('/ticket-promedio', manejar((q) => analyticsService.ticketPromedio(q)));
  return router;
}
module.exports = reportesController;
