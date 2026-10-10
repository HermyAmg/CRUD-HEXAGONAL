// Conecta el puerto de analítica con su adaptador PostgreSQL (inyección de dependencias)
const pool = require('./db');
const AnalyticsRepositoryAdapter = require('../db/AnalyticsRepositoryAdapter');
const crearAnalyticsService = require('../../application/usecases/analyticsService');

module.exports = crearAnalyticsService({
  analyticsRepository: new AnalyticsRepositoryAdapter(pool),
});
