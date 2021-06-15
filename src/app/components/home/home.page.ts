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
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('inicio');
    }

    this.spinnerLoading = true;
    if (this.longitude && this.latitude) {
      this.postService.buscaPosts(this.longitude, this.latitude).subscribe(post => {
        if (post.length == 0 ) {
          this.show = true
        } else {
          this.show = false;
        }
        this.spinnerLoading = false;
        this.postComUsuarios = post;
      })
    }
  }

  ngOnInit() {

    
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


        this.userService.buscaUserLogado().subscribe(user => {
          this.currentUserId = user.id
          this.currentUserAvatar = user.avatar
          localStorage.setItem('currentUser', JSON.stringify(user))
          this.postService.buscaPosts(this.longitude, this.latitude).subscribe(post => {
            if (post.length == 0 ) {
              this.show = true
            } else {
              this.show = false;
            }
            this.spinnerLoading = false;
            this.postComUsuarios = post;
          }, error => {
            console.log(error)
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
    this.spinnerActions = true;
    this.router.navigate(['edit-post'], {
      queryParams: post
    });
    this.spinnerActions = false;
  }

  deletePost(post)
  {
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
        })
      } else {
        this.spinnerActions = false;
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

  async presentToast(resp) {
    const toast = await this.toastController.create({
      message: resp,
      duration: 6000
    });
    toast.present();
  }

  async logoutToast() {
    const toast = await this.toastController.create({
      message: 'Logout feito com sucesso!',
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

  visualizaPerfil(post)
  {
    this.router.navigate(['perfil'], {
      queryParams: post.user
    });
  }

  logout()
  {
    localStorage.clear();
    sessionStorage.clear();
    this.logoutToast();
    this.router.navigateByUrl('inicio');
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
