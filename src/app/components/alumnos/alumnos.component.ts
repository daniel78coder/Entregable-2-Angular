import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../shared/services/data.service';
import { Alumno } from '../../shared/models/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-alumnos',
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
  ],
  templateUrl: './alumnos.component.html',
})
export class AlumnosComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<Alumno>([]);
  alumnoForm: FormGroup;
  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellido',
    'email',
    'telefono',
    'acciones',
  ];
  searchText = '';
  showForm = false;
  editingId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.alumnoForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,}$/)]],
    });
  }

  ngOnInit(): void {
    this.loadAlumnos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAlumnos(): void {
    this.dataService
      .getAlumnos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((alumnos) => {
        this.dataSource.data = alumnos;
        this.applyFilter();
      });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  onSubmit(): void {
    if (this.alumnoForm.valid) {
      const alumnoData = this.alumnoForm.value as Omit<Alumno, 'id'>;

      const operation$ = this.editingId
        ? this.dataService.updateAlumno({ ...alumnoData, id: this.editingId })
        : this.dataService.addAlumno(alumnoData);

      operation$.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.snackBar.open(
            `Alumno ${this.editingId ? 'actualizado' : 'creado'} correctamente`,
            'Cerrar',
            { duration: 3000 }
          );
          this.resetForm();
          this.loadAlumnos();
        },
        error: (error) => {
          this.snackBar.open(
            `Error al ${this.editingId ? 'actualizar' : 'crear'} alumno`,
            'Cerrar',
            { duration: 3000 }
          );
          console.error(error);
        },
      });
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.alumnoForm.reset();
    this.editingId = null;
    this.showForm = false;
  }

  verDetalle(alumno: Alumno): void {
    const detalle = `ID: ${alumno.id}
Nombre: ${alumno.nombre}
Apellido: ${alumno.apellido}
Email: ${alumno.email}
Teléfono: ${alumno.telefono}`;
    alert(detalle);
  }

  editarAlumno(alumno: Alumno): void {
    this.editingId = alumno.id;
    this.alumnoForm.patchValue(alumno);
    this.showForm = true;
  }

  eliminarAlumno(alumno: Alumno): void {
    if (confirm(`¿Eliminar a ${alumno.nombre} ${alumno.apellido}?`)) {
      this.dataService
        .deleteAlumno(alumno.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Alumno eliminado', 'Cerrar', {
              duration: 3000,
            });
            this.loadAlumnos();
          },
          error: (error) => {
            this.snackBar.open('Error al eliminar alumno', 'Cerrar', {
              duration: 3000,
            });
            console.error(error);
          },
        });
    }
  }
}
