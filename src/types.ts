// Forma de los datos que devuelve el backend (BitBE).
// TypeScript usa estas interfaces para avisarte si escribís mal un campo.

export interface Usuario {
  id: number
  username: string
  nombre: string
  apellido: string
  email: string
}

export interface Viaje {
  id: number
  nombre: string
  descripcion?: string // el "?" indica que puede no venir
  fechaInicio: string // las fechas llegan como texto ISO: "2026-01-10T00:00:00.000Z"
  fechaFin: string
  createdAt: string
  creador: Usuario
}

export interface Lugar {
  id: number
  nombre: string
  descripcion?: string
  calle?: string
  altura?: number
  latitud: number
  longitud: number
  tipo?: 'hospedaje' | 'visita' // columna discriminadora de la jerarquía ISA
}

export interface Localidad {
  id: number
  nombreLocalidad: string
  descripcionLocalidad?: string
}

// Un punto del itinerario mientras se arma el formulario: todavía no existe
// en la base, por eso no tiene id. Al guardar el viaje se crea como
// Hospedaje o Visita según "tipo".
export interface PuntoRecorrido {
  tipo: 'hospedaje' | 'visita'
  nombre: string
  descripcion?: string
  calle?: string
  altura?: number
  latitud: number
  longitud: number
  localidad: number // id de la localidad
  localidadNombre: string // solo para mostrarlo en la lista
}
