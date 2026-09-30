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