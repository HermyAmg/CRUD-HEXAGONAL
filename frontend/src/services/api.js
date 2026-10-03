const BASE_URL = 'http://3.84.172.57:4000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || 'Error en la solicitud');
  return data;
}

export const usuariosApi = {
  registrar: (datos) => request('/usuarios/registro', { method: 'POST', body: JSON.stringify(datos) }),
  login: (datos) => request('/usuarios/login', { method: 'POST', body: JSON.stringify(datos) }),
  listar: () => request('/usuarios'),
  actualizar: (id, datos) => request(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  eliminar: (id) => request(`/usuarios/${id}`, { method: 'DELETE' }),
};

export const productosApi = {
  crear: (datos) => request('/productos', { method: 'POST', body: JSON.stringify(datos) }),
  listar: () => request('/productos'),
  actualizar: (id, datos) => request(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  eliminar: (id) => request(`/productos/${id}`, { method: 'DELETE' }),
};

export const pedidosApi = {
  crear: (datos) => request('/pedidos', { method: 'POST', body: JSON.stringify(datos) }),
  listar: () => request('/pedidos'),
  actualizarEstado: (id, estado) => request(`/pedidos/${id}`, { method: 'PUT', body: JSON.stringify({ estado }) }),
  eliminar: (id) => request(`/pedidos/${id}`, { method: 'DELETE' }),
};
