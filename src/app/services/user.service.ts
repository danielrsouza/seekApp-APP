import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../classes/usuario';
import { UsuarioFacebook } from '../classes/usuarioFacebook';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  buscaUserLogado(): Observable<Usuario>
  {
    const endpoint = "/api/users";
    return this.apiService.get(endpoint)
  }

  buscaUserPorId(id): Observable<Usuario>
  {
    const endpoint = "/api/users";
    return this.apiService.get(`${endpoint}/${id}`)
  }

  buscaUserFbId(id): Observable<UsuarioFacebook>
  {
    const endpoint = "/api/users/facebook";
    return this.apiService.get(`${endpoint}/${id}`)
  }



}
