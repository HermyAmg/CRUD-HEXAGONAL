const ESTADOS = ['pendiente', 'pagado', 'enviado', 'cancelado'];
const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/;

const redondear = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

function normalizarRango({ desde, hasta }) {
  if (!hasta) hasta = new Date().toISOString().slice(0, 10);
  if (!desde) {
    const d = new Date(hasta + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() - 29); // por defecto: últimos 30 días
    desde = d.toISOString().slice(0, 10);
  }
  if (!FECHA_RE.test(desde) || !FECHA_RE.test(hasta)) {
    throw new Error('Las fechas deben tener formato YYYY-MM-DD');
  }
  if (desde > hasta) throw new Error('"desde" no puede ser mayor que "hasta"');
  return { desde, hasta };
}

/**
 * CASO DE USO (puerto de entrada): AnalyticsService.
 * Orquesta las consultas del puerto de analítica y arma los resultados
 * (porcentajes, tickets promedio). No toca las entidades operativas.
 */
function crearAnalyticsService({ analyticsRepository }) {
  const service = {
    async topProductos(filtros) {
      const rango = normalizarRango(filtros);
      const limite = Math.min(Math.max(parseInt(filtros.limite, 10) || 5, 1), 20);
      return analyticsRepository.topProductos({ ...rango, limite });
    },

    async ingresos(filtros) {
      const rango = normalizarRango(filtros);
      const agrupacion = ['dia', 'semana', 'mes'].includes(filtros.agrupacion) ? filtros.agrupacion : 'dia';
      const serie = await analyticsRepository.ingresosPorPeriodo({ ...rango, agrupacion });
      const total = serie.reduce((acc, f) => acc + f.ingresos, 0);
      return { agrupacion, ingresos_totales: redondear(total), serie };
    },

    async estadosPedidos(filtros) {
      const rango = normalizarRango(filtros);
      const filas = await analyticsRepository.estadosPedidos(rango);
      const total = filas.reduce((acc, f) => acc + f.cantidad, 0);
      const distribucion = ESTADOS.map((estado) => {
        const cantidad = filas.find((f) => f.estado === estado)?.cantidad || 0;
        return { estado, cantidad, porcentaje: total ? redondear((cantidad * 100) / total) : 0 };
      });
      return { total_pedidos: total, distribucion };
    },

    async ticketPromedio(filtros) {
      const rango = normalizarRango(filtros);
      const t = await analyticsRepository.totalesVentas(rango);
      return {
        ticket_por_pedido: redondear(t.ticket_por_pedido),
        ticket_por_usuario: t.usuarios_compradores ? redondear(t.ingresos_totales / t.usuarios_compradores) : 0,
        total_pedidos: t.total_pedidos,
        usuarios_compradores: t.usuarios_compradores,
        ingresos_totales: redondear(t.ingresos_totales),
      };
    },

    async resumen(filtros) {
      const rango = normalizarRango(filtros);
      const f = { ...filtros, ...rango };
      const [ticket, ingresos, estados, top] = await Promise.all([
        service.ticketPromedio(f),
        service.ingresos(f),
        service.estadosPedidos(f),
        service.topProductos(f),
      ]);
      return { rango, ticket, ingresos, estados, top_productos: top };
    },
  };
  return service;
}
module.exports = crearAnalyticsService;
