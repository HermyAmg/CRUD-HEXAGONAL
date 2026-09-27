export default function ListaEstudiantes({ items = [], columnas, onEditar, onEliminar }) {
  if (items.length === 0) {
    return <p style={{ fontSize: 14, color: '#666' }}>No hay registros aún.</p>;
  }

  return (
    <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {columnas.map((c) => (
            <th key={c.key}>{c.label}</th>
          ))}
          {(onEditar || onEliminar) && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={item.id_usuario || item.id_producto || item.id_pedido || idx}>
            {columnas.map((c) => (
              <td key={c.key}>{String(item[c.key])}</td>
            ))}
            {(onEditar || onEliminar) && (
              <td>
                {onEditar && <button onClick={() => onEditar(item)}>Editar</button>}{' '}
                {onEliminar && <button onClick={() => onEliminar(item)}>Eliminar</button>}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
