import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private hasGroupSubject = new BehaviorSubject<string | null>(localStorage.getItem('hasGroup'));
  hasGroup$ = this.hasGroupSubject.asObservable();

  private initialsSubject = new BehaviorSubject<string | null>(this.getInitialsFromLocalStorage());
  initials$ = this.initialsSubject.asObservable();

  setHasGroup(hasGroup: string) {
    localStorage.setItem('hasGroup', hasGroup);
    this.hasGroupSubject.next(hasGroup);
  }

  setInitials(firstName: string, lastName: string) {
    if (firstName && lastName) {
      const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
      localStorage.setItem('firstname', firstName);
      localStorage.setItem('lastname', lastName);
      this.initialsSubject.next(initials);
    } else {
      console.error('First name or last name is undefined');
    }
  }

  private getInitialsFromLocalStorage(): string | null {
    const firstName = localStorage.getItem('firstname');
    const lastName = localStorage.getItem('lastname');
    return firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() : null;
  }
}