import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private hasGroupSubject = new BehaviorSubject<string | null>(localStorage.getItem('hasGroup'));
  hasGroup$ = this.hasGroupSubject.asObservable();

  setHasGroup(hasGroup: string) {
    localStorage.setItem('hasGroup', hasGroup);
    this.hasGroupSubject.next(hasGroup);
  }
}