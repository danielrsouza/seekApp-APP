import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  postComUsuarios: any[];
  currentUserId;
  skeleton = false;
  spinnerLoading = false;
  longitude;
  latitude;
  spinnerActions = false;
  show = false;
  currentUserAvatar;
  mostraPost = true;

  constructor(
    private router: Router, 
    private userService: UserService,
    private postService: PostService,
    public toastController: ToastController,
    private geolocation: Geolocation
  ) {
      this.skeleton = true;
      this.spinnerLoading = true;
  }

  ionViewWillEnter() {
    console.log('entrou aqui na ionView home')
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('inicio');
    }

    if (this.longitude && this.latitude) {
      this.spinnerLoading = true;
      this.mostraPost = false;
      this.postService.buscaPosts(this.longitude, this.latitude).subscribe(post => {
        if (post.length == 0 ) {
          this.show = true
        } else {
          this.show = false;
        }
        this.spinnerLoading = false;
        this.postComUsuarios = post;
        this.mostraPost = true;
      })
    }
  }

  ngOnInit() {
    console.log('entrou aqui na ngInit home')

    this.spinnerLoading = true;
    this.geolocation.getCurrentPosition()
    .then((resp) => {
      localStorage.setItem('longitude', JSON.stringify(resp.coords.longitude))
      localStorage.setItem('latitude', JSON.stringify(resp.coords.latitude))
      this.longitude = localStorage.getItem('longitude')
      this.latitude = localStorage.getItem('latitude')
     })
     .catch((error) => {
        this.erroPermissao();
        this.router.navigateByUrl('login');
     })
     .finally( () => {
      console.log('entrou aqui na finally home')

        this.userService.buscaUserLogado().subscribe(user => {
          this.currentUserId = user.id
          this.currentUserAvatar = user.avatar
          localStorage.setItem('currentUser', JSON.stringify(user))

          if (user.telefone == '0000000') {
            this.router.navigateByUrl('facebook-telefone');
          }

          this.spinnerLoading = true;
          this.postService.buscaPosts(this.longitude, this.latitude).subscribe(post => {
            console.log(  'buscando pos')
            if (post.length == 0 ) {
              this.show = true
            } else {
              this.show = false;
            }
            this.postComUsuarios = post;
            this.spinnerLoading = false;
          }, error => {
            this.errorAoBuscarPost();
            this.router.navigateByUrl('login');
            this.spinnerLoading = false;
          })
        }, error => {
          console.log(error)
          this.erroAoBuscarUsuario();
          this.router.navigateByUrl('login');
        }) 
     });
  }

  cadastrapost()
  {
    this.router.navigateByUrl('cadastrapost');
  }

  detalhePost(post)
  {
    this.spinnerActions = true;
    this.router.navigate(['detalhepost'], {
      queryParams: post
    });
    this.spinnerActions = false;
  }

  editPost(post) {
    this.spinnerLoading = true;
    this.spinnerActions = true;
    this.router.navigate(['edit-post'], {
      queryParams: post
    });
    this.spinnerActions = false;
    this.spinnerLoading = false;
  }

  deletePost(post)
  {
    this.spinnerLoading = true;
    this.spinnerActions = true;
    this.postService.deletaPost(post.id).subscribe(resp => {
      this.presentToast(resp.message);
      if (resp.success) {
        this.postService.buscaPosts(this.longitude, this.latitude).subscribe(posts => {
          if (posts.length == 0 ) {
            this.show = true
          } else {
            this.show = false;
          }
          this.postComUsuarios = posts;
          this.spinnerActions = false;
          this.spinnerLoading = false;
        })
      } else {
        this.spinnerActions = false;
        this.spinnerLoading = false;
      }
    })
  }

  doRefresh(event) {

    setTimeout(() => {
      this.postService.buscaPosts(this.longitude, this.latitude).subscribe(post => {
        this.postComUsuarios = post;
      })
      event.target.complete();
    }, 2000);
  }

  perfilUsuario()
  {
    this.router.navigateByUrl('perfil-usuario');
  }

  async presentToast(resp) {
    const toast = await this.toastController.create({
      message: resp,
      duration: 6000
    });
    toast.present();
  }

  async erroAoBuscarUsuario() {
    const toast = await this.toastController.create({
      message: 'Erro ao buscar usuário!',
      duration: 6000
    });
    toast.present();
  }

  async erroPermissao() {
    const toast = await this.toastController.create({
      message: 'Você precisa dar permissão de localização!',
      duration: 6000
    });
    toast.present();
  }

  async errorAoBuscarPost() {
    const toast = await this.toastController.create({
      message: 'Não foi possível buscar os posts!',
      duration: 6000
    });
    toast.present();
  }

  visualizaPerfil(post)
  {
    this.router.navigate(['perfil'], {
      queryParams: post.user
    });
  }



  mudaStatus(status, id)
  {
    this.spinnerActions = true;
    this.postService.mudaStatusPost(status, id).subscribe(resp => {
      this.postService.buscaPosts(this.longitude, this.latitude).subscribe(posts => {
        this.postComUsuarios = posts;
        this.spinnerActions = false;
      })
    })
  }
}
