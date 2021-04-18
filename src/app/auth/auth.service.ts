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

  private logged = new BehaviorSubject<Boolean>(false);

  get isLoggedIn(): Observable<any> {
    return this.logged.asObservable();
  }

  constructor(private http: HttpClient, private apiService: ApiService) { }

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
}
