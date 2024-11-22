import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  fullName: string = '';
  emailError: boolean = false;
  passwordError: boolean = false;
  fullNameError: boolean = false;

  constructor(private router: Router) {}

  register() {
    this.emailError = !this.email;
    this.passwordError = this.password.length < 6;
    this.fullNameError = !this.fullName;

    if (!this.emailError && !this.passwordError && !this.fullNameError) {
      alert('Vous êtes bien inscrit');
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/']);
    }
  }
}
