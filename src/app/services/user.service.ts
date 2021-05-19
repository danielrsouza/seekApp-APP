import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../classes/usuario';
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

  buscaUserFacebook(idfb): Observable<Usuario>
  {
    const endpoint = "/api/users";
    return this.apiService.get(`${endpoint}/facebook/${idfb}`)
  }

}
