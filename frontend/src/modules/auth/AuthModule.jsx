import { useState } from 'react';
import Formulario from '../../components/Formulario';
import { usuariosApi } from '../../services/api';

export default function AuthModule({ onLogin }) {
  const [mensaje, setMensaje] = useState('');
  const [modo, setModo] = useState('login');

  const camposLogin = [
    { name: 'correo', label: 'Correo', type: 'email' },
    { name: 'password', label: 'Contraseña', type: 'password' },
  ];

  const camposRegistro = [
    { name: 'nombre', label: 'Nombre' },
    { name: 'correo', label: 'Correo', type: 'email' },
    { name: 'password', label: 'Contraseña', type: 'password' },
  ];

  const handleLogin = async (datos) => {
    const usuario = await usuariosApi.login(datos);
    setMensaje(`Bienvenido, ${usuario.nombre}`);
    onLogin?.(usuario);
  };

  const handleRegistro = async (datos) => {
    const usuario = await usuariosApi.registrar(datos);
    setMensaje(`Usuario ${usuario.nombre} registrado correctamente`);
    setModo('login');
  };

  return (
    <section>
      <h2>{modo === 'login' ? 'Iniciar sesión' : 'Registro de usuario'}</h2>
      {modo === 'login' ? (
        <Formulario campos={camposLogin} onSubmit={handleLogin} textoBoton="Entrar" />
      ) : (
        <Formulario campos={camposRegistro} onSubmit={handleRegistro} textoBoton="Registrarme" />
      )}
      <button onClick={() => setModo(modo === 'login' ? 'registro' : 'login')} style={{ marginTop: 8 }}>
        {modo === 'login' ? 'Crear cuenta nueva' : 'Ya tengo cuenta'}
      </button>
      {mensaje && <p>{mensaje}</p>}
    </section>
  );
}
