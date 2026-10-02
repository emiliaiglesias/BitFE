import NavBar from '../layout/NavBar'
import BuscadorLugares from './BuscadorLugares'
import Timeline from '../timeline/Timeline'
import type { Usuario } from '../types'

interface HomeProps {
  usuario: Usuario
  onCerrarSesion: () => void
}

// Pantalla principal (ruta "/"): header con buscador + navegación, y abajo el timeline.
function Home({ usuario, onCerrarSesion }: HomeProps) {
  return (
    <div className="pantalla">
      <NavBar usuario={usuario} onCerrarSesion={onCerrarSesion} />

      <BuscadorLugares />

      <main>
        <Timeline usuarioId={usuario.id} />
      </main>
    </div>
  )
}

export default Home
