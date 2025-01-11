import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  isLoggedIn: boolean = false;
  dropdownOpen: boolean = false;

  constructor(private router: Router) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedIn = false;
    this.dropdownOpen = false;
    this.router.navigate(['/']);
  }
}