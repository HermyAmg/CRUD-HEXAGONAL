import { useEffect, useState } from 'react';
import Formulario from '../../components/Formulario';
import ListaEstudiantes from '../../components/ListaEstudiantes';
import { pedidosApi } from '../../services/api';

const campos = [
  { name: 'id_usuario', label: 'ID de usuario', type: 'number' },
  { name: 'id_producto', label: 'ID de producto', type: 'number' },
  { name: 'cantidad', label: 'Cantidad', type: 'number' },
];

const columnas = [
  { key: 'id_pedido', label: 'ID' },
  { key: 'id_usuario', label: 'Usuario' },
  { key: 'estado', label: 'Estado' },
  { key: 'total', label: 'Total' },
];

export default function PedidosModule() {
  const [pedidos, setPedidos] = useState([]);

  const cargar = async () => setPedidos(await pedidosApi.listar());

  useEffect(() => {
    cargar();
  }, []);

  const crear = async ({ id_usuario, id_producto, cantidad }) => {
    await pedidosApi.crear({
      id_usuario,
      detalles: [{ id_producto, cantidad }],
    });
    await cargar();
  };

  const eliminar = async (item) => {
    await pedidosApi.eliminar(item.id_pedido);
    await cargar();
  };

  return (
    <section>
      <h2>Pedidos</h2>
      <Formulario campos={campos} onSubmit={crear} textoBoton="Crear pedido" />
      <div style={{ marginTop: 16 }}>
        <ListaEstudiantes items={pedidos} columnas={columnas} onEliminar={eliminar} />
      </div>
    </section>
  );
}
