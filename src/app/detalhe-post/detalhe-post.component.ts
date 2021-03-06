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
  skeleton = false;
  avatar;
  mostraComentarios = true;

  constructor(
    private route: ActivatedRoute, 
    private postService: PostService, 
    private comentarioService: ComentariosService, 
    private fb: FormBuilder,
    private router: Router
    ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.postId = params.id;

      this.postService.buscaPostPorId(params.id).subscribe(post => {
        this.imgPost = post.imagem;
        this.nome = post.user.nome;
        this.descricao = post.descricao;
        this.userPost = post.user;
        this.avatar = post.user.avatar
        this.skeleton = true;

          this.comentarioService.buscaComent(post.id).subscribe(comentarios => {
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
    this.mostraComentarios = false;
    if (this.inputComment == true) {
      this.inputComment = false;
    } else {
      this.inputComment = true;
    }
    this.criaFormulario(new Comentario())

  }

  criaFormulario(comentario: Comentario)
  {
    this.formComentario = this.fb.group({
      descricao: [comentario.descricao],
    })
  }

  persistComentario()
  {
    this.spinnerLoading = true;
    let currentUser: Usuario = JSON.parse(localStorage.getItem('currentUser'));
    this.novoComentario = this.formComentario.value;
    this.novoComentario.id_post = this.postId;
    this.novoComentario.id_usuario = currentUser.id;

    this.comentarioService.insereComentario(this.novoComentario).subscribe(resp => {
      console.log('retorno', resp);
      this.inputComment = false;
      this.comentarioService.buscaComent(this.postId).subscribe(comentarios => {
        console.log('ue', comentarios);
        if (comentarios.length > 0) {
          this.show = true;
        } else {
          this.show = false;
        }
        this.comentarios = comentarios;
      })
    })
    console.log(this.formComentario);
    this.spinnerLoading = false;
    this.mostraComentarios = true;
  }

  visualizaPerfil()
  {
    this.router.navigate(['perfil'], {
      queryParams: this.userPost
    });
  }

  visualizaPerfilComentario(userComentario)
  {
    this.router.navigate(['perfil'], {
      queryParams: userComentario
    });
  }
}
