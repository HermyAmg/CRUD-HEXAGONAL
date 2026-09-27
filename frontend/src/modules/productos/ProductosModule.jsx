import { useEffect, useState } from 'react';
import Formulario from '../../components/Formulario';
import ListaEstudiantes from '../../components/ListaEstudiantes';
import { productosApi } from '../../services/api';

const campos = [
  { name: 'nombre', label: 'Nombre' },
  { name: 'descripcion', label: 'Descripción', required: false },
  { name: 'precio', label: 'Precio', type: 'number' },
  { name: 'stock', label: 'Stock', type: 'number' },
];

const columnas = [
  { key: 'id_producto', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'precio', label: 'Precio' },
  { key: 'stock', label: 'Stock' },
];

export default function ProductosModule() {
  const [productos, setProductos] = useState([]);

  const cargar = async () => setProductos(await productosApi.listar());

  useEffect(() => {
    cargar();
  }, []);

  const crear = async (datos) => {
    await productosApi.crear(datos);
    await cargar();
  };

  const eliminar = async (item) => {
    await productosApi.eliminar(item.id_producto);
    await cargar();
  };

  return (
    <section>
      <h2>Catálogo de productos</h2>
      <Formulario campos={campos} onSubmit={crear} textoBoton="Agregar producto" />
      <div style={{ marginTop: 16 }}>
        <ListaEstudiantes items={productos} columnas={columnas} onEliminar={eliminar} />
      </div>
    </section>
  );
}
