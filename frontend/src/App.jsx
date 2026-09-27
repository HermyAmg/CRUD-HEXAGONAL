import { useState } from 'react';
import AuthModule from './modules/auth/AuthModule';
import ProductosModule from './modules/productos/ProductosModule';
import PedidosModule from './modules/pedidos/PedidosModule';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('auth');

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1>Sistema E-commerce - CRUD Hexagonal</h1>
      {usuario && <p>Sesión: {usuario.nombre} ({usuario.rol})</p>}

      <nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button onClick={() => setVista('auth')}>Autenticación</button>
        <button onClick={() => setVista('productos')}>Productos</button>
        <button onClick={() => setVista('pedidos')}>Pedidos</button>
      </nav>

      {vista === 'auth' && <AuthModule onLogin={setUsuario} />}
      {vista === 'productos' && <ProductosModule />}
      {vista === 'pedidos' && <PedidosModule />}
    </div>
  );
}
