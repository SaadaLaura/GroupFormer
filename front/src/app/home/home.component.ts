import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  userRole: string | null = null;

  constructor(private router: Router, private stateService: StateService, private usersService: UsersService) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (this.isLoggedIn) {
      const token = localStorage.getItem('token');
      if (token) {
        this.usersService.getUserInfo(token).subscribe(user => {
          this.userRole = user.role;
        });
      }
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}