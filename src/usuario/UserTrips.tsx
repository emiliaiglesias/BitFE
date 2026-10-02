import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../layout/NavBar'
import ViajeCard from '../timeline/ViajeCard'
import type { Usuario, Viaje } from '../types'
import '../timeline/Timeline.css'

interface UserTripsProps {
  usuario: Usuario
  onCerrarSesion: () => void
}

// Ruta "/viajes". Mismo patrón que Timeline, pero filtrando por creador:
// acá se ven solo los viajes propios.
function UserTrips({ usuario, onCerrarSesion }: UserTripsProps) {
  const [viajes, setViajes] = useState<Viaje[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarMisViajes() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/viajes?creador=${usuario.id}`
        )
        const data = await res.json()

        if (res.ok) {
          setViajes(data.data)
        } else {
          setError(data.message || 'No se pudieron cargar tus viajes')
        }
      } catch {
        setError('No se pudo conectar con el servidor. Revisá que BitBE esté corriendo.')
      } finally {
        setCargando(false)
      }
    }

    cargarMisViajes()
  }, [usuario.id])

  return (
    <div className="pantalla">
      <NavBar usuario={usuario} onCerrarSesion={onCerrarSesion} />

      <main className="timeline">
        <h2 className="timeline-titulo">Mis viajes</h2>

        {/* Acción principal de la pantalla: va al formulario de creación */}
        <Link to="/viajes/nuevo" className="boton-principal">
          + Crear nuevo viaje
        </Link>

        {cargando && <p className="timeline-estado">Cargando tus viajes…</p>}

        {error && <p className="timeline-estado timeline-estado--error">{error}</p>}

        {!cargando && !error && viajes.length === 0 && (
          <p className="timeline-estado">
            Todavía no cargaste ningún viaje. Cuando crees uno, va a aparecer acá.
          </p>
        )}

        {!cargando && !error && viajes.length > 0 && (
          <ol className="timeline-lista">
            {viajes.map((viaje) => (
              <ViajeCard key={viaje.id} viaje={viaje} />
            ))}
          </ol>
        )}
      </main>
    </div>
  )
}

export default UserTrips
