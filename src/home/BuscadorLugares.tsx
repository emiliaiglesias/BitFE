import { useState } from 'react'
import type { Lugar } from '../types'

// Buscador de lugares del header de la Home.
// Pega contra GET /api/lugares?nombre=... (lectura polimórfica: hospedajes y visitas).
function BuscadorLugares() {
  const [texto, setTexto] = useState('')
  // null = todavía no se buscó nada; [] = se buscó y no hubo resultados
  const [resultados, setResultados] = useState<Lugar[] | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const consulta = texto.trim()
    if (!consulta) {
      setResultados(null)
      setError('')
      return
    }

    setBuscando(true)
    setError('')

    try {
      const res = await fetch(
        `http://localhost:3000/api/lugares?nombre=${encodeURIComponent(consulta)}`
      )
      const data = await res.json()

      if (res.ok) {
        setResultados(data.data)
      } else {
        setResultados(null)
        setError(data.message || 'No se pudo buscar')
      }
    } catch {
      setResultados(null)
      setError('No se pudo conectar con el servidor. Revisá que BitBE esté corriendo.')
    } finally {
      setBuscando(false)
    }
  }

  function limpiar() {
    setTexto('')
    setResultados(null)
    setError('')
  }

  return (
    <div className="buscador">
      <form className="buscador-form" onSubmit={handleSubmit} role="search">
        <label htmlFor="buscador-lugares">Buscar lugares</label>
        <input
          id="buscador-lugares"
          type="search"
          placeholder="Ej: Cataratas, hostel, museo…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <button type="submit" disabled={buscando}>
          {buscando ? 'Buscando…' : 'Buscar'}
        </button>
        {resultados !== null && (
          <button type="button" onClick={limpiar}>
            Limpiar
          </button>
        )}
      </form>

      {error && <p className="buscador-error">{error}</p>}

      {resultados !== null && !error && (
        <div className="buscador-resultados">
          {resultados.length === 0 ? (
            <p>No encontramos lugares que coincidan con “{texto.trim()}”.</p>
          ) : (
            <ul>
              {resultados.map((lugar) => (
                <li key={lugar.id}>
                  <strong>{lugar.nombre}</strong>
                  {lugar.tipo && <span> ({lugar.tipo})</span>}
                  {lugar.descripcion && <p>{lugar.descripcion}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default BuscadorLugares
