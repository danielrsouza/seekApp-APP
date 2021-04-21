import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Post } from '../classes/post';
import { Usuario } from '../classes/usuario';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-cadastrapost',
  templateUrl: './cadastrapost.component.html',
  styleUrls: ['./cadastrapost.component.scss'],
})
export class CadastrapostComponent implements OnInit {

  formPost: FormGroup;
  post: Post;
  spinnerLoading = false;
  currentUser: Usuario

  constructor(    
    private fb: FormBuilder,
    public toastController: ToastController,
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.criaFormulario(new Post())
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  persistPost()
  {
    this.spinnerLoading = true
    this.post = this.formPost.value
    this.post.id_usuario = this.currentUser.id;

    this.postService.cadastra(this.post).subscribe(post => {
      this.spinnerLoading = false;
      this.presentToast();
      this.router.navigateByUrl('home')
    })

  }


  criaFormulario(post: Post)
  {
    this.formPost = this.fb.group({
      descricao: [post.descricao],
      imagem: [post.imagem],
    })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Post cadastrado com sucesso!',
      duration: 6000
    });
    toast.present();
  }

}
