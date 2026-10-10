import { useState } from 'react';
import AuthModule from './modules/auth/AuthModule';
import ProductosModule from './modules/productos/ProductosModule';
import PedidosModule from './modules/pedidos/PedidosModule';
import DashboardModule from './modules/dashboard/DashboardModule';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('auth');
  const esAdmin = usuario?.rol === 'admin';

  const handleLogin = (u) => {
    setUsuario(u);
    setVista(u.rol === 'admin' ? 'dashboard' : 'productos');
  };
  const cerrarSesion = () => {
    setUsuario(null);
    setVista('auth');
  };
  const tab = (id, texto) => (
    <button className={`tab ${vista === id ? 'activo' : ''}`} onClick={() => setVista(id)}>{texto}</button>
  );

  return (
    <>
      <header className="topbar">
        <div className="brand">🛒 Tienda Hexagonal</div>
        <nav>
          {tab('auth', 'Cuenta')}
          {tab('productos', 'Productos')}
          {tab('pedidos', 'Pedidos')}
          {esAdmin && tab('dashboard', '📊 Dashboard')}
        </nav>
        <div className="usuario">
          {usuario ? (
            <>
              <span>{usuario.nombre} <small className="badge">{usuario.rol}</small></span>
              <button className="tab" onClick={cerrarSesion}>Salir</button>
            </>
          ) : (
            <span className="muted">Sin sesión</span>
          )}
        </div>
      </header>

      <main className="contenedor">
        {vista === 'auth' && <AuthModule onLogin={handleLogin} />}
        {vista === 'productos' && <ProductosModule />}
        {vista === 'pedidos' && <PedidosModule />}
        {vista === 'dashboard' &&
          (esAdmin ? (
            <DashboardModule usuario={usuario} />
          ) : (
            <section>
              <h2>Acceso restringido</h2>
              <p>El dashboard es exclusivo para usuarios con rol administrador.</p>
            </section>
          ))}
      </main>
    </>
  );
}
