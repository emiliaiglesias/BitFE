import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './auth/Register'
import Login from './auth/Login'
import Home from './home/Home'
import UserProfile from './usuario/UserProfile'
import UserTrips from './usuario/UserTrips'
import CrearViaje from './usuario/CrearViaje'
import type { Usuario } from './types'

function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [vista, setVista] = useState<'login' | 'registro'>('login')

  // Sin sesión no se entra a ninguna ruta privada: siempre login/registro.
  if (!usuario) {
    return (
      <div>
        <h1>Bitácora de alumnos</h1>
        <nav>
          <button onClick={() => setVista('login')}>Iniciar sesión</button>
          <button onClick={() => setVista('registro')}>Registrarse</button>
        </nav>
        {vista === 'login' ? <Login onLogin={setUsuario} /> : <Register />}
      </div>
    )
  }

  function cerrarSesion() {
    setUsuario(null)
  }

  // Con sesión abierta, el router decide qué pantalla mostrar según la URL.
  return (
    <Routes>
      <Route path="/" element={<Home usuario={usuario} onCerrarSesion={cerrarSesion} />} />
      <Route
        path="/perfil"
        element={<UserProfile usuario={usuario} onCerrarSesion={cerrarSesion} />}
      />
      <Route
        path="/viajes"
        element={<UserTrips usuario={usuario} onCerrarSesion={cerrarSesion} />}
      />
      <Route
        path="/viajes/nuevo"
        element={<CrearViaje usuario={usuario} onCerrarSesion={cerrarSesion} />}
      />
      {/* Cualquier otra URL vuelve al timeline */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
