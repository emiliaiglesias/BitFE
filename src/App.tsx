import { useState } from 'react'
import Register from './auth/Register'
import Login from './auth/Login'
import Timeline from './timeline/Timeline'
import type { Usuario } from './types'

function App() {
  // null = nadie logueado. Cuando Login llama a onLogin, guardamos al usuario acá.
  const [usuario, setUsuario] = useState<Usuario | null>(null) // Le especifica a TypeScript que el estado puede ser un Usuario o null

  /* Equivale a esto:
    const [usuario, setUsuario] = useState(null);
    const resultado = useState(null);
    const usuario = resultado[0];
    const setUsuario = resultado[1]; */

  const [vista, setVista] = useState<'login' | 'registro'>('login')

  /* Es const porque con cada renderización se crea una nueva función, pero no cambia */

  // Si hay alguien logueado, mostramos la página de inicio (el timeline)
  if (usuario) {
    return (
      <div>
        <header>
          <h1>Bitácora de Viajes</h1>
          <p>
            Hola, {usuario.nombre}{' '} // Concatenar comillas para que haya espacio
            <button onClick={() => setUsuario(null)}>Cerrar sesión</button> 
            /* OnClick es una propiedad que se pasa a los componentes de React para manejar eventos de clic */
          </p>
        </header>
        <Timeline usuarioId={usuario.id} />
      </div>
    )
  }

  // Si no, mostramos login / registro como antes
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

export default App