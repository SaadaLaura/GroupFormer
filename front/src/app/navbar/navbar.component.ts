import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  initials: string = '';
  dropdownOpen: boolean = false;
  hasGroup: string | null = null;

  constructor(private router: Router, private stateService: StateService) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.stateService.initials$.subscribe(initials => {
      this.initials = initials || '';
    });

    this.stateService.hasGroup$.subscribe(hasGroup => {
      this.hasGroup = hasGroup;
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    localStorage.clear();
    this.isLoggedIn = false;
    this.dropdownOpen = false;
    this.router.navigate(['/login']);
  }
}