import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { StateService } from '../services/state.service';

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
  emailError: boolean = false;
  passwordError: boolean = false;
  loginError: boolean = false;
  emailNotFoundError: boolean = false;
  showPasswordInput: boolean = false;
  userType: string = '';

  constructor(private router: Router, private studentService: StudentService, private stateService: StateService) {}

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  nextStep() {
    this.emailError = !this.email;
    this.emailNotFoundError = false;

    if (this.email) {
      if (this.userType === 'student') {
        this.studentService.getStudents().subscribe((students: any[]) => {
          const student = students.find(s => s.email === this.email);
          if (student) {
            this.showPasswordInput = true;
          } else {
            this.emailNotFoundError = true;
          }
        });
      } 
    }
  }

  login() {
    this.passwordError = !this.password;
    this.loginError = false;

    if (this.email && this.password) {
      this.studentService.getStudents().subscribe((students: any[]) => {
        const student = students.find(s => s.email === this.email);
        if (student && student.password === this.password) {
          // Logique de connexion réussie
          localStorage.setItem('isLoggedIn', 'true');
          if (student.firstname && student.lastname) {
            this.stateService.setInitials(student.firstname, student.lastname);
          } else {
            console.error('First name or last name is undefined');
          }
          this.stateService.setUserId(student.id_user);
          this.router.navigate(['/profil', student.id_user]);
          this.loginError = true;
          this.password = ''; // Réinitialiser le champ de mot de passe
        }
      });
    }
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}