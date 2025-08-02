export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number; 
  precio: number;
}

export interface Inscripcion {
  id: number;
  alumnoId: number;
  cursoId: number;
  fechaInscripcion: Date;
  estado: 'Activa' | 'Completada' | 'Cancelada';
  alumnoNombre?: string;
  cursoNombre?: string;
}
