import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comentario } from '../classes/comentario';
import { Post } from '../classes/post';
import { Usuario } from '../classes/usuario';
import { ComentariosService } from '../services/comentarios.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-detalhe-post',
  templateUrl: './detalhe-post.component.html',
  styleUrls: ['./detalhe-post.component.scss'],
})
export class DetalhePostComponent implements OnInit {


  nome;
  descricao;
  userComentario;
  comentarios: Comentario;
  show = true;

  constructor(private route: ActivatedRoute, private postService: PostService, private userSerice: UserService, private comentarioService: ComentariosService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.postService.buscaPostPorId(params.id).subscribe(resp => {
        this.nome = resp.user.nome;
        this.descricao = resp.descricao


        this.comentarioService.buscaComent(resp.id).subscribe(comentarios => {
          if (comentarios.length > 0) {
            this.show = true;
          } else {
            this.show = false;
          }
          this.comentarios = comentarios;
        })
      })
    });
  }

}
