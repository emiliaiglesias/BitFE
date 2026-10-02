import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import NavBar from '../layout/NavBar'
import BuscadorParticipantes from './BuscadorParticipantes'
import PuntosRecorrido from './PuntosRecorrido'
import type { PuntoRecorrido, Usuario } from '../types'

interface CrearViajeProps {
  usuario: Usuario
  onCerrarSesion: () => void
}

// Ruta "/viajes/nuevo". Tres bloques: datos del viaje, compañeros y recorrido.
// El creador no se pide: sale de la sesión.
function CrearViaje({ usuario, onCerrarSesion }: CrearViajeProps) {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
  })

  // Las dos relaciones N:M del viaje se arman en memoria y recién se mandan
  // al backend cuando se guarda todo junto.
  const [participantes, setParticipantes] = useState<Usuario[]>([])
  const [puntos, setPuntos] = useState<PuntoRecorrido[]>([])

  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // Cada punto del recorrido es un Lugar que todavía no existe en la base.
  // Hay que crearlo primero (como Hospedaje o Visita) para tener su id,
  // porque el viaje se relaciona con lugares ya guardados.
  async function crearLugares(): Promise<number[]> {
    const ids: number[] = []

    for (const punto of puntos) {
      const recurso = punto.tipo === 'hospedaje' ? 'hospedajes' : 'visitas'
      const res = await fetch(`http://localhost:3000/api/${recurso}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: punto.nombre,
          descripcion: punto.descripcion,
          calle: punto.calle,
          altura: punto.altura,
          latitud: punto.latitud,
          longitud: punto.longitud,
          localidad: punto.localidad,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || `No se pudo crear el punto “${punto.nombre}”`)
      }

      ids.push(data.data.id)
    }

    return ids
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Misma regla que valida el backend, pero avisada antes de pegarle al server
    if (form.fechaFin < form.fechaInicio) {
      setError('La fecha de fin no puede ser anterior a la de inicio')
      return
    }

    setGuardando(true)
    setError('')

    try {
      const lugaresIds = await crearLugares()

      const res = await fetch('http://localhost:3000/api/viajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          // si quedó vacía no la mandamos: la descripción es opcional
          descripcion: form.descripcion.trim() || undefined,
          fechaInicio: form.fechaInicio,
          fechaFin: form.fechaFin,
          creador: usuario.id,
          participantes: participantes.map((p) => p.id),
          lugares: lugaresIds,
        }),
      })
      const data = await res.json()

      if (res.ok) {
        // Vuelve a "Mis viajes", que recarga la lista y ya muestra el nuevo
        navigate('/viajes')
      } else {
        setError(data.message || 'No se pudo crear el viaje')
      }
    } catch (e: unknown) {
      // fetch tira TypeError cuando no hay conexión; el resto son los Error
      // con mensaje propio que lanza crearLugares.
      const sinConexion = e instanceof TypeError
      setError(
        !sinConexion && e instanceof Error
          ? e.message
          : 'No se pudo conectar con el servidor. Revisá que BitBE esté corriendo.'
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="pantalla">
      <NavBar usuario={usuario} onCerrarSesion={onCerrarSesion} />

      <main>
        <h2>Nuevo viaje</h2>

        <form onSubmit={handleSubmit}>
          <section className="datos-viaje">
            <h3>Datos del viaje</h3>

            <div>
              <label htmlFor="nombre">Nombre del viaje</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                maxLength={255}
                required
                placeholder="Ej: Vuelta por el norte"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="descripcion">Descripción (opcional)</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={4}
                placeholder="Contá de qué se trata el viaje…"
                value={form.descripcion}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="fechaInicio">Fecha de inicio</label>
              <input
                id="fechaInicio"
                name="fechaInicio"
                type="date"
                required
                value={form.fechaInicio}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="fechaFin">Fecha de fin</label>
              <input
                id="fechaFin"
                name="fechaFin"
                type="date"
                required
                // el navegador no deja elegir un fin anterior al inicio
                min={form.fechaInicio || undefined}
                value={form.fechaFin}
                onChange={handleChange}
              />
            </div>
          </section>

          <BuscadorParticipantes
            usuarioActual={usuario}
            participantes={participantes}
            onCambio={setParticipantes}
          />

          <PuntosRecorrido puntos={puntos} onCambio={setPuntos} />

          {/* TODO: elegir los países del viaje */}

          <div>
            <button type="submit" disabled={guardando}>
              {guardando ? 'Guardando…' : 'Guardar viaje'}
            </button>
            <Link to="/viajes">Cancelar</Link>
          </div>
        </form>

        {error && <p className="form-error">{error}</p>}
      </main>
    </div>
  )
}

export default CrearViaje
