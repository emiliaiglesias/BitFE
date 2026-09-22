import { useState } from 'react'

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [mensaje, setMensaje] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        setMensaje(`Bienvenido/a, ${data.data.nombre}!`)
      } else {
        setMensaje(data.message || 'Error al iniciar sesión')
      }
    } catch {
      setMensaje('No se pudo conectar con el servidor')
    }
  }

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <label>Contraseña: </label>
          <input name="password" type="password" value={form.password} onChange={handleChange} />
        </div>
        <button type="submit">Ingresar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  )
}

export default Login