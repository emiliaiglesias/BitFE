import { useState } from 'react'
import Register from './auth/Register'
import Login from './auth/Login'

function App() {
  const [vista, setVista] = useState<'login' | 'registro'>('login')

  return (
    <div>
      <h1>Bitácora de Viajes</h1>
      <nav>
        <button onClick={() => setVista('login')}>Iniciar sesión</button>
        <button onClick={() => setVista('registro')}>Registrarse</button>
      </nav>
      {vista === 'login' ? <Login /> : <Register />}
    </div>
  )
}

export default App