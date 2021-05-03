import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comentario } from '../classes/comentario';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  endpoint = "/api/comentarios"
  constructor(private apiService: ApiService) { }

  buscaComent(id): Observable<any>
  {
    return this.apiService.get(`${this.endpoint}/post/${id}`)
  }

  insereComentario(comentario): Observable<any>
  {
    console.log(comentario);
    return this.apiService.post(`${this.endpoint}`, comentario);
  }
}
