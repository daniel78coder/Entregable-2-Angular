import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../../shared/services/data.service';
import { Curso } from '../../shared/models/models';
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
  selector: 'app-cursos',
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
  templateUrl: './cursos.component.html',
})
export class CursosComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<Curso>([]);
  cursoForm: FormGroup;
  displayedColumns: string[] = [
    'id',
    'nombre',
    'descripcion',
    'duracion',
    'precio',
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
    this.cursoForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      duracion: ['', [Validators.required, Validators.min(1)]],
      precio: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadCursos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCursos(): void {
    this.dataService
      .getCursos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cursos) => {
          this.dataSource.data = cursos;
          this.applyFilter();
        },
        error: (error) => {
          this.snackBar.open('Error al cargar cursos', 'Cerrar', {
            duration: 3000,
          });
          console.error(error);
        },
      });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  onSubmit(): void {
    if (this.cursoForm.valid) {
      const cursoData = this.cursoForm.value as Omit<Curso, 'id'>;

      const operation$ = this.editingId
        ? this.dataService.updateCurso({ ...cursoData, id: this.editingId })
        : this.dataService.addCurso(cursoData);

      operation$.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.snackBar.open(
            `Curso ${this.editingId ? 'actualizado' : 'creado'} correctamente`,
            'Cerrar',
            { duration: 3000 }
          );
          this.resetForm();
          this.loadCursos();
        },
        error: (error) => {
          this.snackBar.open(
            `Error al ${this.editingId ? 'actualizar' : 'crear'} curso`,
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
    this.cursoForm.reset();
    this.editingId = null;
    this.showForm = false;
  }

  verDetalle(curso: Curso): void {
    const detalle = `ID: ${curso.id}
Nombre: ${curso.nombre}
Descripción: ${curso.descripcion}
Duración: ${curso.duracion} horas
Precio: $${curso.precio}`;
    alert(detalle);
  }

  editarCurso(curso: Curso): void {
    this.editingId = curso.id;
    this.cursoForm.patchValue(curso);
    this.showForm = true;
  }

  eliminarCurso(curso: Curso): void {
    if (confirm(`¿Eliminar el curso "${curso.nombre}"?`)) {
      this.dataService
        .deleteCurso(curso.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Curso eliminado', 'Cerrar', { duration: 3000 });
            this.loadCursos();
          },
          error: (error) => {
            this.snackBar.open('Error al eliminar curso', 'Cerrar', {
              duration: 3000,
            });
            console.error(error);
          },
        });
    }
  }
}
