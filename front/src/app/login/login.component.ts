import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailError: boolean = false;
  passwordError: boolean = false;
  loginError: boolean = false;

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  login() {
    this.emailError = !this.email;
    this.passwordError = !this.password;
    this.loginError = false;

    if (this.email && this.password) {
      if (this.email === 'laura.saada@efrei.net' && this.password === 'GroupFormer') {
        // Logique de connexion réussie
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/']);
      } else {
        this.loginError = true;
        this.password = ''; // Réinitialiser le champ de mot de passe
      }
    }
  }
}
