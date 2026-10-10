// Servicio de red para los reportes del dashboard (solo admin).
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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
