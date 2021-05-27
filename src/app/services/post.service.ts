import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Post } from '../classes/post';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  endpoint = "/api/posts";

  constructor(private apiService: ApiService, private http: HttpClient) { }

  cadastra(post: Post): Observable<Post>
  {

    const params = {
      id_usuario: post.id_usuario,
      descricao: post.descricao,
      imagem: post.imagem,
      status: true,
      longitude: JSON.stringify(localStorage.getItem('longitude')),
      latitude: JSON.stringify(localStorage.getItem('latitude'))
    }
    
    return this.apiService.post(this.endpoint, params);
  }
  
  buscaPosts(longitude, latitude)
  {
    return this.apiService.get(`${this.endpoint}?latitude=${longitude}?longitude=${latitude}`);
  }

  deletaPost(id)
  {
    return this.apiService.delete(`${this.endpoint}/${id}`)
  }

  buscaPostPorId(id)
  {
    return this.apiService.get(`${this.endpoint}/${id}`)
  }

  mudaStatusPost(status, id) 
  {
    return this.http.get(`${environment.api_url}/api/status?id=${id}&status=${status}`);   
  }
}
