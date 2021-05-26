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

  constructor(
    private router: Router, 
    private userService: UserService,
    private postService: PostService,
    public toastController: ToastController,
    private geolocation: Geolocation
  ) {
    this.postService.buscaPosts().subscribe(post => {
      this.postComUsuarios = post;
      this.skeleton = true;
    })
  }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      localStorage.setItem('longitude', JSON.stringify(resp.coords.longitude))
      localStorage.setItem('latitude', JSON.stringify(resp.coords.latitude))
     }).catch((error) => {
       console.log('Error getting location', error);
     });
     

    this.userService.buscaUserLogado().subscribe(user => {
      this.currentUserId = user.id
      console.log(this.currentUserId)
      localStorage.setItem('currentUser', JSON.stringify(user))
      this.postService.buscaPosts().subscribe(post => {
        this.postComUsuarios = post;
        console.log(post)
      })
    })
  }

  cadastrapost()
  {
    this.router.navigateByUrl('cadastrapost');
  }

  detalhePost(post)
  {
    this.spinnerLoading = true;
    this.router.navigate(['detalhepost'], {
      queryParams: post
    });
  }

  deletePost(post)
  {
    this.postService.deletaPost(post.id).subscribe(resp => {
      this.presentToast(resp.message);
      if (resp.success) {
        this.postService.buscaPosts().subscribe(posts => {
          this.postComUsuarios = posts;
          console.log(posts)
        })
      }
    })
  }

  doRefresh(event) {
    console.log('buscando posts');

    setTimeout(() => {
      this.postService.buscaPosts().subscribe(post => {
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
    this.router.navigateByUrl('login');
  }

  mudaStatus(status, id)
  {
    this.postService.mudaStatusPost(status, id).subscribe(resp => {
      this.postService.buscaPosts().subscribe(posts => {
        this.postComUsuarios = posts;
        console.log(posts)
      })
    })
  }
}
