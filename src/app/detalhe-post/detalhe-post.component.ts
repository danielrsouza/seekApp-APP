import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  postId;
  inputComment = false;
  formComentario: FormGroup;
  spinnerLoading = false;
  novoComentario: Comentario;
  imgPost;
  userPost: Usuario;

  constructor(
    private route: ActivatedRoute, 
    private postService: PostService, 
    private comentarioService: ComentariosService, 
    private fb: FormBuilder,
    private router: Router
    ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.postId = params.id;
      this.postService.buscaPostPorId(params.id).subscribe(resp => {
        console.log('post', resp);
        this.imgPost = resp.imagem;
        this.nome = resp.user.nome;
        this.descricao = resp.descricao;
        this.userPost = resp.user;

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

  comment()
  {
    if (this.inputComment == true) {
      this.inputComment = false;
    } else {
      this.inputComment = true;
    }
    this.criaFormulario(new Comentario())

    
    // let comment

  }

  criaFormulario(comentario: Comentario)
  {
    console.log(comentario);
    this.formComentario = this.fb.group({
      descricao: [comentario.descricao],
    })
  }

  persistComentario()
  {
    let currentUser: Usuario = JSON.parse(localStorage.getItem('currentUser'));
    this.spinnerLoading = true;
    this.novoComentario = this.formComentario.value;
    this.novoComentario.id_post = this.postId;
    this.novoComentario.id_usuario = currentUser.id;

    this.comentarioService.insereComentario(this.novoComentario).subscribe(resp => {
      console.log('retorno', resp);
      this.inputComment = false;
      this.comentarioService.buscaComent(this.postId).subscribe(comentarios => {
        if (comentarios.length > 0) {
          this.show = true;
        } else {
          this.show = false;
        }
        this.comentarios = comentarios;
      })
    })
    console.log(this.formComentario);
  }

  visualizaPerfil()
  {
    this.router.navigate(['perfil'], {
      queryParams: this.userPost
    });
  }
}
