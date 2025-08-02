import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Alumno, Curso, Inscripcion } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private alumnos$ = new BehaviorSubject<Alumno[]>([
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@email.com',
      telefono: '123456789',
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'García',
      email: 'maria@email.com',
      telefono: '987654321',
    },
    {
      id: 3,
      nombre: 'Pedro',
      apellido: 'López',
      email: 'pedro@email.com',
      telefono: '456789123',
    },
  ]);

  private cursos$ = new BehaviorSubject<Curso[]>([
    {
      id: 1,
      nombre: 'Angular Básico',
      descripcion: 'Introducción a Angular',
      duracion: 40,
      precio: 299,
    },
    {
      id: 2,
      nombre: 'React Avanzado',
      descripcion: 'React para expertos',
      duracion: 60,
      precio: 399,
    },
    {
      id: 3,
      nombre: 'Node.js',
      descripcion: 'Backend con Node.js',
      duracion: 50,
      precio: 349,
    },
  ]);

  private inscripciones$ = new BehaviorSubject<Inscripcion[]>([
    {
      id: 1,
      alumnoId: 1,
      cursoId: 1,
      fechaInscripcion: new Date(),
      estado: 'Activa',
    },
    {
      id: 2,
      alumnoId: 2,
      cursoId: 2,
      fechaInscripcion: new Date(),
      estado: 'Completada',
    },
    {
      id: 3,
      alumnoId: 3,
      cursoId: 1,
      fechaInscripcion: new Date(),
      estado: 'Activa',
    },
  ]);

  // Aca tengo los metodos para alumnos
  getAlumnos(): Observable<Alumno[]> {
    return this.alumnos$.asObservable();
  }

  addAlumno(alumno: Omit<Alumno, 'id'>): Observable<Alumno> {
    const current = this.alumnos$.value;
    const newId =
      current.length > 0 ? Math.max(...current.map((a) => a.id)) + 1 : 1;
    const newAlumno = { ...alumno, id: newId };
    this.alumnos$.next([...current, newAlumno]);
    return of(newAlumno);
  }

  updateAlumno(alumno: Alumno): Observable<Alumno> {
    const alumnos = this.alumnos$.value.map((a) =>
      a.id === alumno.id ? alumno : a
    );
    this.alumnos$.next(alumnos);
    return of(alumno);
  }

  deleteAlumno(id: number): Observable<boolean> {
    const alumnos = this.alumnos$.value.filter((a) => a.id !== id);
    this.alumnos$.next(alumnos);
    return of(true);
  }

  // Aca tengo los metodos  para cursos
  getCursos(): Observable<Curso[]> {
    return this.cursos$.asObservable();
  }

  addCurso(curso: Omit<Curso, 'id'>): Observable<Curso> {
    const current = this.cursos$.value;
    const newId =
      current.length > 0 ? Math.max(...current.map((c) => c.id)) + 1 : 1;
    const newCurso = { ...curso, id: newId };
    this.cursos$.next([...current, newCurso]);
    return of(newCurso);
  }

  updateCurso(curso: Curso): Observable<Curso> {
    const cursos = this.cursos$.value.map((c) =>
      c.id === curso.id ? curso : c
    );
    this.cursos$.next(cursos);
    return of(curso);
  }

  deleteCurso(id: number): Observable<boolean> {
    const cursos = this.cursos$.value.filter((c) => c.id !== id);
    this.cursos$.next(cursos);
    return of(true);
  }

  // Aca tengo los metodos para inscripciones
  getInscripciones(): Observable<Inscripcion[]> {
    return this.inscripciones$.asObservable();
  }

  addInscripcion(
    inscripcion: Omit<Inscripcion, 'id'>
  ): Observable<Inscripcion> {
    const current = this.inscripciones$.value;
    const newId =
      current.length > 0 ? Math.max(...current.map((i) => i.id)) + 1 : 1;
    const newInscripcion = { ...inscripcion, id: newId };
    this.inscripciones$.next([...current, newInscripcion]);
    return of(newInscripcion);
  }

  updateInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    const inscripciones = this.inscripciones$.value.map((i) =>
      i.id === inscripcion.id ? inscripcion : i
    );
    this.inscripciones$.next(inscripciones);
    return of(inscripcion);
  }

  deleteInscripcion(id: number): Observable<boolean> {
    const inscripciones = this.inscripciones$.value.filter((i) => i.id !== id);
    this.inscripciones$.next(inscripciones);
    return of(true);
  }
}
