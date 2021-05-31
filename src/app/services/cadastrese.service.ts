import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../classes/usuario';
import { UsuarioFacebook } from '../classes/usuarioFacebook';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CadastreseService {

  constructor(private apiService: ApiService) {}

  cadastra(usuario: Usuario): Observable<Usuario> {
    if (!usuario.avatar) {
      usuario.avatar = null;
    }
    
    return this.apiService.post('/api/users', usuario);
  }

  cadastraFb(usuario: UsuarioFacebook): Observable<UsuarioFacebook> {
    return this.apiService.post('/api/usersFb', usuario);
  }
}
