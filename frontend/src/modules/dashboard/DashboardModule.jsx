import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { reportesApi } from '../../services/reportesApi';

const COLORES_ESTADO = { pendiente: '#f59e0b', pagado: '#3b82f6', enviado: '#10b981', cancelado: '#ef4444' };

const dinero = (n) =>
  Number(n || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

const aISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function rangoPreset(preset) {
  const hoy = new Date();
  const fin = aISO(hoy);
  if (preset === '7d' || preset === '30d') {
    const d = new Date();
    d.setDate(d.getDate() - (preset === '7d' ? 6 : 29));
    return { desde: aISO(d), hasta: fin };
  }
  if (preset === 'mes') {
    return { desde: aISO(new Date(hoy.getFullYear(), hoy.getMonth(), 1)), hasta: fin };
  }
  return null; // "custom": lo eligen las cajas de fecha
}

const PRESETS = [
  { id: '7d', texto: 'Últimos 7 días' },
  { id: '30d', texto: 'Últimos 30 días' },
  { id: 'mes', texto: 'Este mes' },
  { id: 'custom', texto: 'Rango personalizado' },
];

export default function DashboardModule({ usuario }) {
  const [preset, setPreset] = useState('30d');
  const [rango, setRango] = useState(rangoPreset('30d'));
  const [agrupacion, setAgrupacion] = useState('dia');
  const [tipoGrafico, setTipoGrafico] = useState('barras');
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const elegirPreset = (id) => {
    setPreset(id);
    const r = rangoPreset(id);
    if (r) setRango(r);
  };

  useEffect(() => {
    if (!rango.desde || !rango.hasta) return;
    let cancelado = false;
    setCargando(true);
    setError('');
    reportesApi
      .resumen({ ...rango, agrupacion, limite: 5 }, usuario.id_usuario)
      .then((d) => { if (!cancelado) setDatos(d); })
      .catch((e) => { if (!cancelado) setError(e.message); })
      .finally(() => { if (!cancelado) setCargando(false); });
    return () => { cancelado = true; };
  }, [rango, agrupacion, usuario.id_usuario]);

  const etiqueta = (p) => (agrupacion === 'mes' ? p.slice(0, 7) : `${p.slice(8, 10)}/${p.slice(5, 7)}`);
  const serie = datos?.ingresos.serie || [];
  const maxUnidades = Math.max(1, ...(datos?.top_productos || []).map((p) => p.unidades_vendidas));

  const ejes = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="periodo" tickFormatter={etiqueta} stroke="#6b7280" fontSize={12} />
      <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} stroke="#6b7280" fontSize={12} />
      <Tooltip formatter={(v) => dinero(v)} labelFormatter={(l) => `Periodo: ${etiqueta(l)}`} />
    </>
  );

  return (
    <div className="dashboard">
      <div className="dash-encabezado">
        <div>
          <h2>Dashboard de métricas</h2>
          <p className="muted">
            {datos ? `Del ${datos.rango.desde} al ${datos.rango.hasta}` : 'Cargando…'}
            {cargando && ' · actualizando…'}
          </p>
        </div>
      </div>

      <div className="card filtros">
        <div className="chips">
          {PRESETS.map((p) => (
            <button key={p.id} className={`chip ${preset === p.id ? 'activo' : ''}`} onClick={() => elegirPreset(p.id)}>
              {p.texto}
            </button>
          ))}
        </div>
        {preset === 'custom' && (
          <div className="fechas">
            <label>Desde <input type="date" value={rango.desde} onChange={(e) => setRango({ ...rango, desde: e.target.value })} /></label>
            <label>Hasta <input type="date" value={rango.hasta} onChange={(e) => setRango({ ...rango, hasta: e.target.value })} /></label>
          </div>
        )}
        <label className="agrupar">
          Agrupar ingresos por
          <select value={agrupacion} onChange={(e) => setAgrupacion(e.target.value)}>
            <option value="dia">Día</option>
            <option value="semana">Semana</option>
            <option value="mes">Mes</option>
          </select>
        </label>
      </div>

      {error && <div className="alerta">{error}</div>}

      {datos && (
        <>
          <div className="kpis">
            <div className="kpi"><span>Ingresos totales</span><strong>{dinero(datos.ticket.ingresos_totales)}</strong></div>
            <div className="kpi"><span>Pedidos (sin cancelados)</span><strong>{datos.ticket.total_pedidos}</strong></div>
            <div className="kpi"><span>Ticket promedio por pedido</span><strong>{dinero(datos.ticket.ticket_por_pedido)}</strong></div>
            <div className="kpi"><span>Ticket promedio por usuario</span><strong>{dinero(datos.ticket.ticket_por_usuario)}</strong></div>
          </div>

          <div className="rejilla">
            <div className="card grande">
              <div className="card-cab">
                <h3>Tendencia de ingresos</h3>
                <div className="chips">
                  <button className={`chip ${tipoGrafico === 'barras' ? 'activo' : ''}`} onClick={() => setTipoGrafico('barras')}>Barras</button>
                  <button className={`chip ${tipoGrafico === 'lineas' ? 'activo' : ''}`} onClick={() => setTipoGrafico('lineas')}>Líneas</button>
                </div>
              </div>
              {serie.length === 0 ? (
                <p className="vacio">Sin ventas en este rango de fechas.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  {tipoGrafico === 'barras' ? (
                    <BarChart data={serie}>{ejes}<Bar dataKey="ingresos" name="Ingresos" fill="#4f46e5" radius={[6, 6, 0, 0]} /></BarChart>
                  ) : (
                    <LineChart data={serie}>{ejes}<Line type="monotone" dataKey="ingresos" name="Ingresos" stroke="#4f46e5" strokeWidth={3} dot={{ r: 3 }} /></LineChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>

            <div className="card">
              <h3>Estado de los pedidos</h3>
              {datos.estados.total_pedidos === 0 ? (
                <p className="vacio">Sin pedidos en este rango.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={datos.estados.distribucion} dataKey="cantidad" nameKey="estado" outerRadius={95} label={(e) => `${e.porcentaje}%`}>
                      {datos.estados.distribucion.map((e) => <Cell key={e.estado} fill={COLORES_ESTADO[e.estado]} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [`${v} pedidos`, n]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <ul className="estados">
                {datos.estados.distribucion.map((e) => (
                  <li key={e.estado}>
                    <span className="punto" style={{ background: COLORES_ESTADO[e.estado] }} />
                    {e.estado}: <b>{e.cantidad}</b> ({e.porcentaje}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card">
            <h3>Top 5 productos con mayor rotación</h3>
            {datos.top_productos.length === 0 ? (
              <p className="vacio">Sin ventas en este rango.</p>
            ) : (
              <table>
                <thead>
                  <tr><th>#</th><th>Producto</th><th>Unidades vendidas</th><th>Monto recaudado</th></tr>
                </thead>
                <tbody>
                  {datos.top_productos.map((p, i) => (
                    <tr key={p.id_producto}>
                      <td><span className="rank">{i + 1}</span></td>
                      <td>{p.nombre}</td>
                      <td>
                        <div className="barra"><div style={{ width: `${(p.unidades_vendidas / maxUnidades) * 100}%` }} /></div>
                        {p.unidades_vendidas}
                      </td>
                      <td>{dinero(p.monto_recaudado)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
