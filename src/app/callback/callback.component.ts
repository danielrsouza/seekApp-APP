import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { UsuarioLogin } from '../classes/usuarioLogin';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  user = {
    email:'',
    password: ''
}

  constructor(private route: ActivatedRoute,
    private authService: AuthService, 
    private router: Router,
    public toastController: ToastController
    ) { 

    }

  ngOnInit() {
    this.route.queryParams.subscribe(resp => {
      console.log('eeeex');
      this.user.email = resp.username;
      this.user.password = resp.password;
      this.login();
    })
  }

  login() {
    console.log(this.user);
    this.authService.login(this.user).subscribe((response) => {
      console.log(response);
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        this.presentToast();
        this.router.navigateByUrl('home')
      }
    })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Login efetuado com sucesso!',
      duration: 4000
    });
    toast.present();
  }


}
