import { useEffect, useState } from 'react'
import type { Localidad, PuntoRecorrido } from '../types'

interface PuntosRecorridoProps {
  puntos: PuntoRecorrido[]
  onCambio: (puntos: PuntoRecorrido[]) => void
}

const FORM_VACIO = {
  tipo: 'visita' as 'hospedaje' | 'visita',
  nombre: '',
  descripcion: '',
  calle: '',
  altura: '',
  latitud: '',
  longitud: '',
  localidad: '',
}

// Itinerario del viaje. Cada punto es un Lugar de la jerarquía ISA:
// Hospedaje o Visita, según el selector de tipo.
// OJO: el sub-formulario NO puede ser un <form>, porque va anidado dentro
// del formulario del viaje y el HTML no permite forms anidados.
function PuntosRecorrido({ puntos, onCambio }: PuntosRecorridoProps) {
  const [abierto, setAbierto] = useState(false)
  const [form, setForm] = useState(FORM_VACIO)
  const [error, setError] = useState('')

  const [localidades, setLocalidades] = useState<Localidad[]>([])
  const [errorLocalidades, setErrorLocalidades] = useState('')

  // Las localidades se piden una sola vez, al montar
  useEffect(() => {
    async function cargarLocalidades() {
      try {
        const res = await fetch('http://localhost:3000/api/localidades')
        const data = await res.json()
        if (res.ok) {
          setLocalidades(data.data)
        } else {
          setErrorLocalidades(data.message || 'No se pudieron cargar las localidades')
        }
      } catch {
        setErrorLocalidades('No se pudieron cargar las localidades.')
      }
    }

    cargarLocalidades()
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function agregarPunto() {
    // Lo que el backend exige para crear un Hospedaje o una Visita
    if (!form.nombre.trim()) {
      setError('El nombre del punto es obligatorio')
      return
    }
    if (form.latitud === '' || form.longitud === '') {
      setError('La latitud y la longitud son obligatorias')
      return
    }
    if (!form.localidad) {
      setError('Elegí una localidad')
      return
    }

    const localidadId = Number(form.localidad)
    const localidad = localidades.find((l) => l.id === localidadId)

    const punto: PuntoRecorrido = {
      tipo: form.tipo,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || undefined,
      calle: form.calle.trim() || undefined,
      altura: form.altura === '' ? undefined : Number(form.altura),
      latitud: Number(form.latitud),
      longitud: Number(form.longitud),
      localidad: localidadId,
      localidadNombre: localidad?.nombreLocalidad ?? '',
    }

    // Se agrega al final: la lista queda en el orden en que se cargan
    onCambio([...puntos, punto])
    setForm(FORM_VACIO)
    setError('')
    setAbierto(false)
  }

  function quitarPunto(indice: number) {
    onCambio(puntos.filter((_, i) => i !== indice))
  }

  function cancelar() {
    setForm(FORM_VACIO)
    setError('')
    setAbierto(false)
  }

  return (
    <section className="recorrido">
      <h3>Puntos del recorrido</h3>

      {/* Lista de puntos ya cargados, en orden */}
      <ol className="recorrido-lista">
        {puntos.length === 0 ? (
          <li className="recorrido-vacio">Todavía no agregaste puntos al recorrido.</li>
        ) : (
          puntos.map((punto, i) => (
            <li key={i} className="recorrido-item">
              <span className="recorrido-orden">{i + 1}</span>
              <span className={`recorrido-tipo recorrido-tipo--${punto.tipo}`}>
                {punto.tipo === 'hospedaje' ? 'Hospedaje' : 'Visita'}
              </span>
              <span className="recorrido-nombre">{punto.nombre}</span>
              {punto.localidadNombre && (
                <span className="recorrido-localidad">{punto.localidadNombre}</span>
              )}
              <button type="button" onClick={() => quitarPunto(i)}>
                Quitar
              </button>
            </li>
          ))
        )}
      </ol>

      {!abierto && (
        <button type="button" onClick={() => setAbierto(true)}>
          + Agregar punto al recorrido
        </button>
      )}

      {abierto && (
        <div className="recorrido-form">
          <div>
            <label htmlFor="punto-tipo">Tipo de punto</label>
            <select id="punto-tipo" name="tipo" value={form.tipo} onChange={handleChange}>
              <option value="visita">Visita / Actividad</option>
              <option value="hospedaje">Hospedaje</option>
            </select>
          </div>

          <div>
            <label htmlFor="punto-nombre">Nombre</label>
            <input
              id="punto-nombre"
              name="nombre"
              type="text"
              maxLength={100}
              placeholder={
                form.tipo === 'hospedaje'
                  ? 'Ej: Hostel del Centro'
                  : 'Ej: Cataratas del Iguazú'
              }
              value={form.nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="punto-descripcion">Descripción (opcional)</label>
            <textarea
              id="punto-descripcion"
              name="descripcion"
              rows={2}
              value={form.descripcion}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="punto-localidad">Localidad</label>
            <select
              id="punto-localidad"
              name="localidad"
              value={form.localidad}
              onChange={handleChange}
            >
              <option value="">Elegí una localidad…</option>
              {localidades.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombreLocalidad}
                </option>
              ))}
            </select>
            {errorLocalidades && <p className="form-error">{errorLocalidades}</p>}
          </div>

          <div>
            <label htmlFor="punto-calle">Calle (opcional)</label>
            <input
              id="punto-calle"
              name="calle"
              type="text"
              maxLength={150}
              value={form.calle}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="punto-altura">Altura (opcional)</label>
            <input
              id="punto-altura"
              name="altura"
              type="number"
              value={form.altura}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="punto-latitud">Latitud</label>
            <input
              id="punto-latitud"
              name="latitud"
              type="number"
              step="any"
              placeholder="-25.6953"
              value={form.latitud}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="punto-longitud">Longitud</label>
            <input
              id="punto-longitud"
              name="longitud"
              type="number"
              step="any"
              placeholder="-54.4367"
              value={form.longitud}
              onChange={handleChange}
            />
          </div>

          {/* Hoy Hospedaje y Visita heredan los mismos campos de Lugar y no
              agregan ninguno propio. Cuando cada entidad tenga atributos
              específicos (precio por noche, horario, etc.), el bloque de cada
              clase va acá, condicionado por form.tipo. */}

          {error && <p className="form-error">{error}</p>}

          <div>
            <button type="button" onClick={agregarPunto}>
              Agregar al recorrido
            </button>
            <button type="button" onClick={cancelar}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default PuntosRecorrido
