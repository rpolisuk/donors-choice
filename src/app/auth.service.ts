import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

import {User} from './user';
//import { access } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private http: HttpClient ) { }

  public getToken(){
    localStorage.getItem('access_token');
  }
  public setToken(access_token){
    localStorage.setItem('access_token',access_token);
  }

  public getUser(){
    localStorage.getItem('name');
  }
  public setUser(name){
    localStorage.setItem('name',name);
  }

  public getAdmin(){
    localStorage.getItem('admin');
  }
  public setAdmin(admin){
    localStorage.setItem('admin',admin);
  }

  public readToken(): any{
    const token = localStorage.getItem('access_token');
    //return helper.decodeToken(token);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');

    // Note: We can also use helper.isTokenExpired(token) 
    // to see if the token is expired

    if (token) {
      console.log('token exists');
      return true;
    } else {
      console.log('no token');
      return false;
    }
  }

  login(user: User): Observable<any> {
    // Attempt to login
    return this.http.post<any>('http://localhost:8080/api/login', user);
  }
}

function access_token(arg0: string, access_token: any): string {
  throw new Error('Function not implemented.');
}
