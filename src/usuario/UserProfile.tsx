import NavBar from '../layout/NavBar'
import type { Usuario } from '../types'

interface UserProfileProps {
  usuario: Usuario
  onCerrarSesion: () => void
}

// Ruta "/perfil". Estructura base: por ahora muestra los datos que ya tenemos
// de la sesión; las secciones de edición y configuración quedan marcadas.
function UserProfile({ usuario, onCerrarSesion }: UserProfileProps) {
  return (
    <div className="pantalla">
      <NavBar usuario={usuario} onCerrarSesion={onCerrarSesion} />

      <main>
        <h2>Mi perfil</h2>

        <section>
          <h3>Datos personales</h3>
          <dl>
            <dt>Nombre</dt>
            <dd>
              {usuario.nombre} {usuario.apellido}
            </dd>

            <dt>Usuario</dt>
            <dd>@{usuario.username}</dd>

            <dt>Email</dt>
            <dd>{usuario.email}</dd>
          </dl>
        </section>

        {/* TODO: formulario de edición (PUT /api/usuarios/:id) */}
        <section>
          <h3>Editar datos</h3>
          <p>Próximamente vas a poder modificar tus datos desde acá.</p>
        </section>

        {/* TODO: cambio de contraseña y preferencias */}
        <section>
          <h3>Configuración</h3>
          <p>Cambio de contraseña y preferencias de la cuenta.</p>
        </section>
      </main>
    </div>
  )
}

export default UserProfile
