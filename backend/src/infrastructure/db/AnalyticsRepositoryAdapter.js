const AnalyticsRepositoryPort = require('../../application/ports/AnalyticsRepositoryPort');

// Filtro de fechas reutilizable (hasta es inclusivo)
const FILTRO_FECHA = `p.fecha >= $1::date AND p.fecha < ($2::date + INTERVAL '1 day')`;
const UNIDADES = { dia: 'day', semana: 'week', mes: 'month' };

/**
 * ADAPTADOR DE SALIDA: implementa el puerto con consultas SQL agregadas
 * (SUM, COUNT, AVG, GROUP BY). Todo se calcula en PostgreSQL, no en Node.
 * "Ventas" = pedidos que NO están cancelados.
 */
class AnalyticsRepositoryAdapter extends AnalyticsRepositoryPort {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async topProductos({ desde, hasta, limite }) {
    const { rows } = await this.pool.query(
      `SELECT pr.id_producto, pr.nombre,
              SUM(d.cantidad)::int AS unidades_vendidas,
              SUM(d.cantidad * d.precio_unitario)::float8 AS monto_recaudado
       FROM detalle_pedido d
       JOIN pedidos p ON p.id_pedido = d.id_pedido
       JOIN productos pr ON pr.id_producto = d.id_producto
       WHERE p.estado <> 'cancelado' AND ${FILTRO_FECHA}
       GROUP BY pr.id_producto, pr.nombre
       ORDER BY unidades_vendidas DESC, monto_recaudado DESC
       LIMIT $3`,
      [desde, hasta, limite]
    );
    return rows;
  }

  async ingresosPorPeriodo({ desde, hasta, agrupacion }) {
    const unidad = UNIDADES[agrupacion] || 'day'; // lista blanca, nunca se interpola texto del usuario
    const { rows } = await this.pool.query(
      `SELECT to_char(date_trunc($3, p.fecha), 'YYYY-MM-DD') AS periodo,
              COUNT(*)::int AS pedidos,
              COALESCE(SUM(p.total), 0)::float8 AS ingresos
       FROM pedidos p
       WHERE p.estado <> 'cancelado' AND ${FILTRO_FECHA}
       GROUP BY 1
       ORDER BY 1`,
      [desde, hasta, unidad]
    );
    return rows;
  }

  async estadosPedidos({ desde, hasta }) {
    const { rows } = await this.pool.query(
      `SELECT p.estado, COUNT(*)::int AS cantidad
       FROM pedidos p
       WHERE ${FILTRO_FECHA}
       GROUP BY p.estado`,
      [desde, hasta]
    );
    return rows;
  }

  async totalesVentas({ desde, hasta }) {
    const { rows } = await this.pool.query(
      `SELECT COUNT(*)::int AS total_pedidos,
              COUNT(DISTINCT p.id_usuario)::int AS usuarios_compradores,
              COALESCE(SUM(p.total), 0)::float8 AS ingresos_totales,
              COALESCE(AVG(p.total), 0)::float8 AS ticket_por_pedido
       FROM pedidos p
       WHERE p.estado <> 'cancelado' AND ${FILTRO_FECHA}`,
      [desde, hasta]
    );
    return rows[0];
  }
}
module.exports = AnalyticsRepositoryAdapter;
