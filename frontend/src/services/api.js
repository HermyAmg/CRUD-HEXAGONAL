const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const usuariosApi = {
  login: async (credenciales) => {
    const res = await fetch(`${BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credenciales),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
    return data;
  },
  registro: async (datos) => {
    const res = await fetch(`${BASE_URL}/usuarios/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error en el registro');
    return data;
  },
};

export const productosApi = {
  listar: async () => {
    const res = await fetch(`${BASE_URL}/productos`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return res.json();
  },
  crear: async (producto) => {
    const res = await fetch(`${BASE_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });
    if (!res.ok) throw new Error('Error al crear producto');
    return res.json();
  },
  actualizar: async (id, producto) => {
    const res = await fetch(`${BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    });
    if (!res.ok) throw new Error('Error al actualizar producto');
    return res.json();
  },
  eliminar: async (id) => {
    const res = await fetch(`${BASE_URL}/productos/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar producto');
    return res.json();
  },
};

export const pedidosApi = {
  listar: async () => {
    const res = await fetch(`${BASE_URL}/pedidos`);
    if (!res.ok) throw new Error('Error al obtener pedidos');
    return res.json();
  },
  crear: async (pedido) => {
    const res = await fetch(`${BASE_URL}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    });
    if (!res.ok) throw new Error('Error al crear pedido');
    return res.json();
  },
  actualizarEstado: async (id, estado) => {
    const res = await fetch(`${BASE_URL}/pedidos/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    });
    if (!res.ok) throw new Error('Error al actualizar estado');
    return res.json();
  },
};

export const reportesApi = {
  resumen: async ({ desde, hasta, agrupacion, limite } = {}, idUsuario) => {
    const params = new URLSearchParams();
    if (desde) params.append('desde', desde);
    if (hasta) params.append('hasta', hasta);
    if (agrupacion) params.append('agrupacion', agrupacion);
    if (limite) params.append('limite', limite);

    const res = await fetch(`${BASE_URL}/reportes/resumen?${params.toString()}`, {
      headers: { 'x-usuario-id': String(idUsuario) },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || 'Error al cargar los reportes');
    return data;
  },
};

export async function loginUsuario(credenciales) {
  return usuariosApi.login(credenciales);
}

export async function registrarUsuario(datos) {
  return usuariosApi.registro(datos);
}

export default {
  usuariosApi,
  productosApi,
  pedidosApi,
  reportesApi,
  loginUsuario,
  registrarUsuario,
};
