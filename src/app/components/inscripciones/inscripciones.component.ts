import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../shared/services/data.service';
import { Alumno, Curso, Inscripcion } from '../../shared/models/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    DatePipe,
  ],
  templateUrl: './inscripciones.component.html',
})
export class InscripcionesComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  inscripcionForm: FormGroup;
  displayedColumns = [
    'id',
    'alumnoNombre',
    'cursoNombre',
    'fechaInscripcion',
    'estado',
    'acciones',
  ];
  searchText = '';
  showForm = false;
  editingId: number | null = null;
  alumnos$: Observable<Alumno[]>;
  cursos$: Observable<Curso[]>;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.alumnos$ = this.dataService.getAlumnos();
    this.cursos$ = this.dataService.getCursos();
    this.inscripcionForm = this.fb.group({
      id: [null],
      alumnoId: ['', Validators.required],
      cursoId: ['', Validators.required],
      estado: ['Activa', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadInscripciones();
  }

  loadInscripciones(): void {
    combineLatest([
      this.dataService.getInscripciones(),
      this.alumnos$,
      this.cursos$,
    ])
      .pipe(
        map(([inscripciones, alumnos, cursos]) => {
          return inscripciones.map((inscripcion) => ({
            ...inscripcion,
            alumnoNombre: this.getNombreCompleto(alumnos, inscripcion.alumnoId),
            cursoNombre: this.getNombreCurso(cursos, inscripcion.cursoId),
          }));
        })
      )
      .subscribe({
        next: (inscripciones) => {
          this.dataSource.data = inscripciones;
          this.applyFilter();
        },
        error: (err) => {
          console.error('Error cargando inscripciones:', err);
          this.snackBar.open('Error al cargar inscripciones', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }

  private getNombreCompleto(alumnos: Alumno[], id: number): string {
    const alumno = alumnos.find((a) => a.id === id);
    return alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Desconocido';
  }

  private getNombreCurso(cursos: Curso[], id: number): string {
    const curso = cursos.find((c) => c.id === id);
    return curso ? curso.nombre : 'Desconocido';
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  onSubmit() {
    if (this.inscripcionForm.valid) {
      const inscripcion = {
        ...this.inscripcionForm.value,
        fechaInscripcion: new Date(),
      };
      this.dataService.addInscripcion(inscripcion);
      this.inscripcionForm.reset();
      this.inscripcionForm.patchValue({ estado: 'Activa' });
      this.showForm = false;
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.inscripcionForm.reset();
      this.inscripcionForm.patchValue({ estado: 'Activa' });
    }
  }

  editarInscripcion(inscripcion: Inscripcion) {
    this.editingId = inscripcion.id;
    this.inscripcionForm.patchValue({
      id: inscripcion.id,
      alumnoId: inscripcion.alumnoId,
      cursoId: inscripcion.cursoId,
      estado: inscripcion.estado,
    });
    this.showForm = true;
  }

  eliminarInscripcion(inscripcion: Inscripcion) {
    if (confirm(`¿Eliminar la inscripcion ${inscripcion.id}?`)) {
      this.dataService.deleteInscripcion(inscripcion.id);
      this.loadInscripciones();
    }
  }

  verDetalle(inscripcion: any): void {
    const detalle = `
    ID: ${inscripcion.id}
    Alumno: ${inscripcion.alumnoNombre}
    Curso: ${inscripcion.cursoNombre}
    Fecha: ${new Date(inscripcion.fechaInscripcion).toLocaleDateString()}
    Estado: ${inscripcion.estado}
  `;
    alert(detalle);
  }
}
