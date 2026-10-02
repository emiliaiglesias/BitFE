import { useState } from 'react'
import type { Usuario } from '../types'

interface BuscadorParticipantesProps {
  usuarioActual: Usuario // el creador: no se puede agregar a sí mismo
  participantes: Usuario[]
  onCambio: (participantes: Usuario[]) => void
}

// Buscador de compañeros de viaje. Los participantes son usuarios de la app,
// así que no se escriben a mano: se buscan y se eligen de la lista.
function BuscadorParticipantes({
  usuarioActual,
  participantes,
  onCambio,
}: BuscadorParticipantesProps) {
  const [texto, setTexto] = useState('')
  // null = todavía no se buscó; [] = se buscó y no hubo resultados
  const [resultados, setResultados] = useState<Usuario[] | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState('')

  async function buscar() {
    const consulta = texto.trim()
    if (!consulta) {
      setResultados(null)
      setError('')
      return
    }

    setBuscando(true)
    setError('')

    try {
      // excluir al creador ya desde el backend: no es "participante" de su viaje
      const res = await fetch(
        `http://localhost:3000/api/usuarios?buscar=${encodeURIComponent(consulta)}&excluir=${usuarioActual.id}`
      )
      const data = await res.json()

      if (res.ok) {
        setResultados(data.data)
      } else {
        setResultados(null)
        setError(data.message || 'No se pudo buscar usuarios')
      }
    } catch {
      setResultados(null)
      setError('No se pudo conectar con el servidor. Revisá que BitBE esté corriendo.')
    } finally {
      setBuscando(false)
    }
  }

  function agregar(usuario: Usuario) {
    // sin repetidos
    if (participantes.some((p) => p.id === usuario.id)) return
    onCambio([...participantes, usuario])
  }

  function quitar(id: number) {
    onCambio(participantes.filter((p) => p.id !== id))
  }

  // Enter dentro del input no tiene que mandar el formulario del viaje
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      buscar()
    }
  }

  return (
    <section className="participantes">
      <h3>Compañeros de viaje</h3>

      <div className="participantes-buscador">
        <label htmlFor="buscar-participante">Buscar por nombre o email</label>
        <input
          id="buscar-participante"
          type="search"
          placeholder="Ej: ana, ana@mail.com"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" onClick={buscar} disabled={buscando}>
          {buscando ? 'Buscando…' : 'Buscar'}
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {resultados !== null && !error && (
        <div className="participantes-resultados">
          {resultados.length === 0 ? (
            <p>No encontramos usuarios que coincidan con “{texto.trim()}”.</p>
          ) : (
            <ul>
              {resultados.map((u) => {
                const yaEsta = participantes.some((p) => p.id === u.id)
                return (
                  <li key={u.id}>
                    <span>
                      {u.nombre} {u.apellido} (@{u.username}) — {u.email}
                    </span>
                    <button type="button" onClick={() => agregar(u)} disabled={yaEsta}>
                      {yaEsta ? 'Ya agregado' : 'Agregar'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {/* Chips: los participantes ya sumados al viaje */}
      <ul className="chips">
        {participantes.length === 0 ? (
          <li className="chips-vacio">Todavía no agregaste compañeros.</li>
        ) : (
          participantes.map((p) => (
            <li key={p.id} className="chip">
              <span className="chip-avatar" aria-hidden="true">
                {p.nombre.charAt(0)}
              </span>
              <span>
                {p.nombre} {p.apellido}
              </span>
              <button
                type="button"
                className="chip-quitar"
                onClick={() => quitar(p.id)}
                aria-label={`Quitar a ${p.nombre} ${p.apellido}`}
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

export default BuscadorParticipantes
