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

  constructor(private apiService: ApiService) { }

  cadastra(post: Post): Observable<Post>
  {
    const params = {
      id_usuario: post.id_usuario,
      descricao: post.descricao,
      imagem: post.imagem,
      status: true,
      longitude: "11",
      latitude: "11"
    }


    return this.apiService.post(this.endpoint, params);
  }
  
  buscaPosts()
  {
    return this.apiService.get(this.endpoint);
  }

  deletaPost(id)
  {
    return this.apiService.delete(`${this.endpoint}/${id}`)
  }
}
