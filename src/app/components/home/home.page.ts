import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  postComUsuarios: any[];
  currentUserId;

  constructor(private router: Router, private userService: UserService,
    private postService: PostService,
    public toastController: ToastController) {}

  ngOnInit() {
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

  deletePost(post)
  {
    this.postService.deletaPost(post.id).subscribe(resp => {
      this.presentToast();
      this.postService.buscaPosts().subscribe(posts => {
        this.postComUsuarios = posts;
        console.log(posts)
      })
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

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Post deletado com sucesso!',
      duration: 6000
    });
    toast.present();
  }
}
