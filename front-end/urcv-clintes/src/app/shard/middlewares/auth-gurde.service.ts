import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGurde {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(route:any, state: RouterStateSnapshot) {
    if (localStorage.getItem('token')) {
      return true;
    }
    this.router.navigate(['auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return true;
  }
}
