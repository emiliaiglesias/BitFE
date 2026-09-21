import { useState, useEffect } from 'react'

function App() {
  const [paises, setPaises] = useState<any[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/paises')
      .then((res) => res.json())
      .then((json) => setPaises(json.data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <div>
      <h1>Bitácora de Viajes Prueba</h1>
      <h2>Países</h2>
      <ul>
        {paises.map((pais) => (
          <li key={pais.id}>{pais.nombrePais}</li>
        ))}
      </ul>
    </div>
  )
}

export default App