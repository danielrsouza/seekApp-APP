import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../classes/usuario';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CadastreseService {

  constructor(private apiService: ApiService) {}

  cadastra(usuario: Usuario): Observable<Usuario> {
    return this.apiService.post('/api/users', usuario);
  }
}
