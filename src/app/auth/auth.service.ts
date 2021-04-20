import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuarioLogin } from '../classes/usuarioLogin';
import { LoginUser } from '../interfaces/login-user';

import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(user: UsuarioLogin): Observable<any>{
    const params = {
      client_id: environment.client_id,
      client_secret: environment.client_secret,
      username: user.email,
      password: user.password,
      grant_type: 'password' 
    }
    return this.http.post<any>(`${environment.api_url}/oauth/token`, {...params});

  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();

    if (token) {
      return true;
    } else {
      return false;
    }
  }
}
