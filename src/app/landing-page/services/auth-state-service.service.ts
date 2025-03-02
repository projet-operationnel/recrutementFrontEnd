// auth-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ParentService } from '../../shared/services/Api/parent.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService extends ParentService{
  private authStateSubject = new BehaviorSubject<'login' | 'register'>('login');
  authState$ = this.authStateSubject.asObservable();

  setAuthState(state: 'login' | 'register') {
    this.authStateSubject.next(state);
  }
}