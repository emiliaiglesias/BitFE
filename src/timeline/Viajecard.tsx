import type { Viaje } from '../types'

interface ViajeCardProps {
  viaje: Viaje
}

// Las fechas se cargan como "2026-01-10", que JavaScript interpreta en UTC.
// Si las mostráramos en hora argentina (UTC-3) aparecerían un día antes,
// por eso los formateadores usan timeZone: 'UTC'.
const formatoFecha = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const formatoMes = new Intl.DateTimeFormat('es-AR', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const MS_POR_DIA = 1000 * 60 * 60 * 24

function calcularDias(inicio: Date, fin: Date): number {
  return Math.round((fin.getTime() - inicio.getTime()) / MS_POR_DIA) + 1
}

function ViajeCard({ viaje }: ViajeCardProps) {
  const inicio = new Date(viaje.fechaInicio)
  const fin = new Date(viaje.fechaFin)
  const dias = calcularDias(inicio, fin)

  return (
    <li className="timeline-item">
      <time className="timeline-fecha" dateTime={viaje.fechaInicio}>
        {formatoMes.format(inicio)}
      </time>

      <span className="timeline-punto" aria-hidden="true" />

      <article className="viaje-card">
        <p className="viaje-autor">
          <span className="viaje-avatar" aria-hidden="true">
            {viaje.creador.nombre.charAt(0)}
          </span>
          <span>
            {viaje.creador.nombre} {viaje.creador.apellido}
            <span className="viaje-username">@{viaje.creador.username}</span>
          </span>
        </p>

        <h3 className="viaje-nombre">{viaje.nombre}</h3>

        <p className="viaje-fechas">
          Del {formatoFecha.format(inicio)} al {formatoFecha.format(fin)}
          <span className="viaje-dias">
            {dias} {dias === 1 ? 'día' : 'días'}
          </span>
        </p>

        {/* && = "si hay descripción, mostrala"; si no, no se renderiza nada */}
        {viaje.descripcion && (
          <p className="viaje-descripcion">{viaje.descripcion}</p>
        )}
      </article>
    </li>
  )
}

export default ViajeCard