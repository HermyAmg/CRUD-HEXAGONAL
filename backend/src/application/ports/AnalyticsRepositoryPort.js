/**
 * PUERTO DE SALIDA (analítica): contrato que la aplicación necesita
 * para consultar métricas. No sabe nada de PostgreSQL.
 * Cada método recibe { desde, hasta } (YYYY-MM-DD) y devuelve datos YA agregados.
 */
class AnalyticsRepositoryPort {
  async topProductos({ desde, hasta, limite }) { throw new Error('No implementado'); }
  async ingresosPorPeriodo({ desde, hasta, agrupacion }) { throw new Error('No implementado'); }
  async estadosPedidos({ desde, hasta }) { throw new Error('No implementado'); }
  async totalesVentas({ desde, hasta }) { throw new Error('No implementado'); }
}
module.exports = AnalyticsRepositoryPort;
