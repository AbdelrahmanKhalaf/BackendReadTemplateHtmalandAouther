import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IRegister } from '../models/IRegister';
import {ILogin } from '../models/Ilogin'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,private router:Router) { }
  getToken():any{
   return localStorage.getItem('token')
  }
  removToken():any{
    localStorage.removeItem('token'),
    this.router.navigate(['/auth/login']);
  }
  makeRegister(IRegister:IRegister){
    return this.http.post(`${environment.url}/singup`,IRegister)
  }
  login(ILogin:ILogin){
    return this.http.post(`${environment.url}/auth/login`,ILogin)

  }
}
