const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { usuarioUseCases, productoUseCases, pedidoUseCases } = require('./infrastructure/config/container');
const usuarioController = require('./infrastructure/http/usuarioController');
const productoController = require('./infrastructure/http/productoController');
const pedidoController = require('./infrastructure/http/pedidoController');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioController(usuarioUseCases));
app.use('/api/productos', productoController(productoUseCases));
app.use('/api/pedidos', pedidoController(pedidoUseCases));
app.use('/api/reportes', require('./infrastructure/http/reportesController')(require('./infrastructure/config/analyticsContainer'), usuarioUseCases));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
