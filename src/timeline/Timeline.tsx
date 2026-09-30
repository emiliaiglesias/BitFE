import { useEffect, useState } from 'react'
import type { Viaje } from '../types'
import ViajeCard from './ViajeCard'
import './Timeline.css'

interface TimelineProps {
  usuarioId: number // para pedirle al backend que no traiga mis propios viajes
}

function Timeline({ usuarioId }: TimelineProps) {
  const [viajes, setViajes] = useState<Viaje[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarViajes() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/viajes?excluirCreador=${usuarioId}`
        )
        const data = await res.json()

        if (res.ok) {
          setViajes(data.data)
        } else {
          setError(data.message || 'No se pudieron cargar los viajes')
        }
      } catch {
        setError('No se pudo conectar con el servidor. Revisá que BitBE esté corriendo.')
      } finally {
        setCargando(false) // se ejecuta siempre, haya salido bien o mal
      }
    }

    cargarViajes()
  }, [usuarioId]) // se vuelve a ejecutar solo si cambia el usuario

  // Tres estados antes de mostrar la lista: cargando, error y vacío
  if (cargando) {
    return <p className="timeline-estado">Cargando viajes…</p>
  }

  if (error) {
    return <p className="timeline-estado timeline-estado--error">{error}</p>
  }

  if (viajes.length === 0) {
    return (
      <p className="timeline-estado">
        Todavía nadie más publicó viajes. Cuando alguien comparta uno, va a aparecer acá.
      </p>
    )
  }

  return (
    <section className="timeline">
      <h2 className="timeline-titulo">Viajes de la comunidad</h2>
      <ol className="timeline-lista">
        {viajes.map((viaje) => (
          <ViajeCard key={viaje.id} viaje={viaje} />
        ))}
      </ol>
    </section>
  )
}

export default Timeline