import { NavLink } from 'react-router-dom'
import type { Usuario } from '../types'

interface NavBarProps {
  usuario: Usuario
  onCerrarSesion: () => void
}

// Barra superior compartida por las tres pantallas, así desde cualquiera
// se puede volver al timeline, ir a "Mis viajes" o entrar al perfil.
function NavBar({ usuario, onCerrarSesion }: NavBarProps) {
  return (
    <header className="nav">
      <h1 className="nav-marca">Bitácora de Viajes</h1>

      {/* Pestañas principales. NavLink marca sola cuál está activa. */}
      <nav className="nav-tabs">
        {/* "end" evita que "/" quede activa estando en /viajes */}
        <NavLink to="/" end>
          Inicio
        </NavLink>
        <NavLink to="/viajes">Mis viajes</NavLink>
      </nav>

      {/* Esquina superior derecha: acceso al perfil */}
      <div className="nav-acciones">
        <NavLink to="/perfil" className="nav-perfil" title={`Perfil de ${usuario.nombre}`}>
          <span className="nav-avatar" aria-hidden="true">
            {usuario.nombre.charAt(0)}
          </span>
          <span>{usuario.nombre}</span>
        </NavLink>
        <button type="button" onClick={onCerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}

export default NavBar
