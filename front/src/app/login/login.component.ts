import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { StateService } from '../services/state.service';
import { LoginResponse, ChangePasswordResponse } from '../class/Login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  emailError: boolean = false;
  passwordError: boolean = false;
  loginError: boolean = false;
  emailNotFoundError: boolean = false;
  showChangePasswordForm: boolean = false;
  changePasswordError: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(private router: Router, private usersService: UsersService, private stateService: StateService) {}

  togglePasswordVisibility(fieldId: string) {
    const passwordInput = document.getElementById(fieldId) as HTMLInputElement;
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
    this.emailNotFoundError = false;

    if (this.email && this.password) {
      this.usersService.login(this.email, this.password).subscribe({
        next: (response: LoginResponse) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('isLoggedIn', 'true');
          if (response.first_connection == "1") { 
            this.showChangePasswordForm = true;
          } else {
            this.router.navigate(['/profil']);
          }
        },
        error: () => {
          this.loginError = true;
        }
      });
    } else {
      this.loginError = true;
    }
  }

  changePassword() {
    this.passwordError = this.newPassword !== this.confirmPassword;
    this.changePasswordError = false;

    if (!this.passwordError) {
      this.usersService.changePassword(this.oldPassword, this.newPassword, this.confirmPassword).subscribe({
        next: (response: ChangePasswordResponse) => {
          localStorage.setItem('token', response.token); // Stocker le nouveau token
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.router.navigate(['/profil']);
          }, 3000);
        },
        error: () => {
          this.changePasswordError = true;
        }
      });
    }
  }

  cancelChangePassword() {
    this.showChangePasswordForm = false;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  areAllFieldsFilled(): boolean {
    return this.oldPassword !== '' && this.newPassword !== '' && this.confirmPassword !== '';
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}