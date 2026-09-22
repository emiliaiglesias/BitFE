import { useState } from 'react'

function Register() {
  const [form, setForm] = useState({
    username: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  })
  const [mensaje, setMensaje] = useState('')

  // Esta función se ejecuta cada vez que el usuario escribe en cualquier campo
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,                    // copio todo lo que ya había
      [e.target.name]: e.target.value,  // y piso solo el campo que cambió
    })
  }

  // Esta función se ejecuta cuando se envía el formulario
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // evita que la página se recargue

    try {
      const res = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        setMensaje('Usuario creado con éxito')
      } else {
        setMensaje(data.message || 'Error al registrar')
      }
    } catch {
      setMensaje('No se pudo conectar con el servidor')
    }
  }

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario: </label>
          <input name="username" value={form.username} onChange={handleChange} />
        </div>
        <div>
          <label>Nombre: </label>
          <input name="nombre" value={form.nombre} onChange={handleChange} />
        </div>
        <div>
          <label>Apellido: </label>
          <input name="apellido" value={form.apellido} onChange={handleChange} />
        </div>
        <div>
          <label>Email: </label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <label>Contraseña: </label>
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  )
}

export default Register