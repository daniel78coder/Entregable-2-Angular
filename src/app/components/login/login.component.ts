import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    this.authService.login(this.credentials.username, this.credentials.password).subscribe({
      next: () => {
        const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/alumnos';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.errorMessage = 'Credenciales incorrectas';
      }
    });
  }
}
