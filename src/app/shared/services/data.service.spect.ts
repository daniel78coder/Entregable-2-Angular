import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { Alumno, Curso, Inscripcion } from '../models/models';
import { take } from 'rxjs/operators';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Alumnos', () => {
    it('should get initial alumnos', (done) => {
      service.getAlumnos().pipe(take(1)).subscribe(alumnos => {
        expect(alumnos.length).toBe(3);
        expect(alumnos[0].nombre).toBe('Juan');
        done();
      });
    });

    it('should add a new alumno', (done) => {
      const newAlumno: Omit<Alumno, 'id'> = {
        nombre: 'Nuevo',
        apellido: 'Alumno',
        email: 'nuevo@email.com',
        telefono: '111222333'
      };

      service.addAlumno(newAlumno).subscribe(addedAlumno => {
        expect(addedAlumno.id).toBe(4);
        expect(addedAlumno.nombre).toBe('Nuevo');

        service.getAlumnos().pipe(take(1)).subscribe(alumnos => {
          expect(alumnos.length).toBe(4);
          expect(alumnos.find(a => a.id === 4)).toBeTruthy();
          done();
        });
      });
    });

    it('should update an alumno', (done) => {
      const updatedAlumno: Alumno = {
        id: 1,
        nombre: 'Juan Updated',
        apellido: 'Pérez',
        email: 'juan@email.com',
        telefono: '123456789'
      };

      service.updateAlumno(updatedAlumno).subscribe(alumno => {
        expect(alumno.nombre).toBe('Juan Updated');

        service.getAlumnos().pipe(take(1)).subscribe(alumnos => {
          expect(alumnos.find(a => a.id === 1)?.nombre).toBe('Juan Updated');
          done();
        });
      });
    });

    it('should delete an alumno', (done) => {
      service.deleteAlumno(1).subscribe(success => {
        expect(success).toBeTrue();

        service.getAlumnos().pipe(take(1)).subscribe(alumnos => {
          expect(alumnos.length).toBe(2);
          expect(alumnos.find(a => a.id === 1)).toBeFalsy();
          done();
        });
      });
    });
  });

  describe('Cursos', () => {
    it('should get initial cursos', (done) => {
      service.getCursos().pipe(take(1)).subscribe(cursos => {
        expect(cursos.length).toBe(3);
        expect(cursos[0].nombre).toBe('Angular Básico');
        done();
      });
    });

    it('should add a new curso', (done) => {
      const newCurso: Omit<Curso, 'id'> = {
        nombre: 'Nuevo Curso',
        descripcion: 'Descripción',
        duracion: 30,
        precio: 199
      };

      service.addCurso(newCurso).subscribe(addedCurso => {
        expect(addedCurso.id).toBe(4);
        expect(addedCurso.nombre).toBe('Nuevo Curso');

        service.getCursos().pipe(take(1)).subscribe(cursos => {
          expect(cursos.length).toBe(4);
          done();
        });
      });
    });

    it('should update a curso', (done) => {
      const updatedCurso: Curso = {
        id: 1,
        nombre: 'Angular Updated',
        descripcion: 'Introducción a Angular',
        duracion: 40,
        precio: 299
      };

      service.updateCurso(updatedCurso).subscribe(curso => {
        expect(curso.nombre).toBe('Angular Updated');

        service.getCursos().pipe(take(1)).subscribe(cursos => {
          expect(cursos.find(c => c.id === 1)?.nombre).toBe('Angular Updated');
          done();
        });
      });
    });

    it('should delete a curso', (done) => {
      service.deleteCurso(1).subscribe(success => {
        expect(success).toBeTrue();

        service.getCursos().pipe(take(1)).subscribe(cursos => {
          expect(cursos.length).toBe(2);
          expect(cursos.find(c => c.id === 1)).toBeFalsy();
          done();
        });
      });
    });
  });

  describe('Inscripciones', () => {
    it('should get initial inscripciones', (done) => {
      service.getInscripciones().pipe(take(1)).subscribe(inscripciones => {
        expect(inscripciones.length).toBe(3);
        expect(inscripciones[0].alumnoId).toBe(1);
        done();
      });
    });

    it('should add a new inscripcion', (done) => {
      const newInscripcion: Omit<Inscripcion, 'id'> = {
        alumnoId: 2,
        cursoId: 3,
        fechaInscripcion: new Date(),
        estado: 'Activa'
      };

      service.addInscripcion(newInscripcion).subscribe(addedInscripcion => {
        expect(addedInscripcion.id).toBe(4);
        expect(addedInscripcion.alumnoId).toBe(2);

        service.getInscripciones().pipe(take(1)).subscribe(inscripciones => {
          expect(inscripciones.length).toBe(4);
          done();
        });
      });
    });

    it('should update an inscripcion', (done) => {
      const updatedInscripcion: Inscripcion = {
        id: 1,
        alumnoId: 1,
        cursoId: 1,
        fechaInscripcion: new Date(),
        estado: 'Cancelada'
      };

      service.updateInscripcion(updatedInscripcion).subscribe(inscripcion => {
        expect(inscripcion.estado).toBe('Cancelada');

        service.getInscripciones().pipe(take(1)).subscribe(inscripciones => {
          expect(inscripciones.find(i => i.id === 1)?.estado).toBe('Cancelada');
          done();
        });
      });
    });

    it('should delete an inscripcion', (done) => {
      service.deleteInscripcion(1).subscribe(success => {
        expect(success).toBeTrue();

        service.getInscripciones().pipe(take(1)).subscribe(inscripciones => {
          expect(inscripciones.length).toBe(2);
          expect(inscripciones.find(i => i.id === 1)).toBeFalsy();
          done();
        });
      });
    });
  });

  describe('Combinados', () => {
    it('should get alumnos and cursos together', (done) => {
      service.getAlumnosConCursos().pipe(take(1)).subscribe(({ alumnos, cursos }) => {
        expect(alumnos.length).toBe(3);
        expect(cursos.length).toBe(3);
        expect(alumnos[0].nombre).toBe('Juan');
        expect(cursos[0].nombre).toBe('Angular Básico');
        done();
      });
    });
  });
});
