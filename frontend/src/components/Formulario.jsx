import { useState } from 'react';

export default function Formulario({ campos, onSubmit, textoBoton = 'Guardar' }) {
  const valoresIniciales = Object.fromEntries(
    campos.map((c) => [c.name, c.defaultValue ?? ''])
  );
  const [valores, setValores] = useState(valoresIniciales);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setValores((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(valores);
      setValores(valoresIniciales);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
      {campos.map((campo) => (
        <label key={campo.name} style={{ display: 'flex', flexDirection: 'column', fontSize: 14 }}>
          {campo.label}
          <input
            name={campo.name}
            type={campo.type || 'text'}
            value={valores[campo.name]}
            onChange={handleChange}
            required={campo.required !== false}
          />
        </label>
      ))}
      {error && <p style={{ color: 'crimson', fontSize: 13 }}>{error}</p>}
      <button type="submit">{textoBoton}</button>
    </form>
  );
}
