import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../services/users.service';

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
  firstname: string = '';
  lastname: string = '';
  emailError: boolean = false;
  passwordError: boolean = false;
  firstnameError: boolean = false;
  lastnameError: boolean = false;

  constructor(private router: Router, private usersService: UsersService) {}

  register() {
    this.emailError = !this.email;
    this.passwordError = !this.password;
    this.firstnameError = !this.firstname;
    this.lastnameError = !this.lastname;

    if (!this.emailError && !this.passwordError && !this.firstnameError && !this.lastnameError) {
      const user = {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: this.password,
        role: 'admin' // Role is set to 'admin'
      };

      this.usersService.register(user).subscribe({
        next: () => {
          alert('Vous êtes bien inscrit');
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription:', error);
          alert('Erreur lors de l\'inscription');
        }
      });
    }
  }
}