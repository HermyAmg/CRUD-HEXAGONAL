const BASE_URL = 'http://localhost:4000/api';

export const reportesApi = {
  resumen: async ({ desde, hasta, agrupacion, limite }, idUsuario) => {
    const qs = new URLSearchParams({ desde, hasta, agrupacion, limite }).toString();
    const res = await fetch(`${BASE_URL}/reportes/resumen?${qs}`, {
      headers: { 'x-usuario-id': String(idUsuario) },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || 'Error al cargar los reportes');
    return data;
  },
};

export async function loginUsuario(credenciales) {
  const res = await fetch(`${BASE_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciales),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
  return data;
}

export async function registrarUsuario(datos) {
  const res = await fetch(`${BASE_URL}/usuarios/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error en el registro');
  return data;
}

export default {
  loginUsuario,
  registrarUsuario,
  reportesApi,
};
