const pool = require('./db');

// Adaptadores de salida
const PgUsuarioRepository = require('../db/PgUsuarioRepository');
const PgProductoRepository = require('../db/PgProductoRepository');
const PgPedidoRepository = require('../db/PgPedidoRepository');
const passwordHasher = require('../security/bcryptPasswordHasher');

// Casos de uso
const crearUsuarioUseCases = require('../../application/usecases/usuarioUseCases');
const crearProductoUseCases = require('../../application/usecases/productoUseCases');
const crearPedidoUseCases = require('../../application/usecases/pedidoUseCases');

const usuarioRepository = new PgUsuarioRepository(pool);
const productoRepository = new PgProductoRepository(pool);
const pedidoRepository = new PgPedidoRepository(pool);

const usuarioUseCases = crearUsuarioUseCases({ usuarioRepository, passwordHasher });
const productoUseCases = crearProductoUseCases({ productoRepository });
const pedidoUseCases = crearPedidoUseCases({ pedidoRepository, productoRepository, usuarioRepository });

module.exports = { usuarioUseCases, productoUseCases, pedidoUseCases };
