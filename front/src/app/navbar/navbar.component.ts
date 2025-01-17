import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StateService } from '../shared/state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  dropdownOpen: boolean = false;
  hasGroup: string | null = null;

  constructor(private router: Router, private stateService: StateService) {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit() {
    this.stateService.hasGroup$.subscribe(hasGroup => {
      this.hasGroup = hasGroup;
    });
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