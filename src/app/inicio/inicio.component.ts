import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLogin, FacebookLoginPlugin } from '@capacitor-community/facebook-login'
import { Plugins, registerWebPlugin} from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { UsuarioFacebook } from '../classes/usuarioFacebook';
import { CadastreseService } from '../services/cadastrese.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  //Facebook
  fbLogin: FacebookLoginPlugin
  userfb: UsuarioFacebook = null;
  token = null;
  userId = null;
  spinnerLoading = false;

  slideOpts = {
    initialSlide: 2,
    speed: 10
  };

  constructor(
    private router: Router,
    private cadastraService: CadastreseService,
    private http: HttpClient,
    private userService: UserService,
    private authService: AuthService, 
    public toastController: ToastController,
  ) {}

  ngOnInit() {

  }


  cadastrese() {
    this.router.navigateByUrl('cadastrese')
  }

  login() {
    this.router.navigateByUrl('login')
  }

  async loginFb(): Promise<void> {
    this.spinnerLoading = true;
    const FACEBOOK_PERMISSIONS = ['public_profile', 'email'];

    const result = await Plugins.FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });

    if (result && result.accessToken) {
      this.token = result.accessToken.token
      this.userId = result.accessToken.userId
      this.carregaDadosUserFb()
      // this.router.navigate(["/home"], navigationExtras);
    }
  }

  
  async carregaDadosUserFb() {
    const url = `https://graph.facebook.com/${this.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${this.token}`;
    this.http.get<any>(url).subscribe(res => {
      console.log(res);
      this.userService.buscaUserFbId(res.id).subscribe(usuarioFb => {
        if (usuarioFb) {
          usuarioFb.password = usuarioFb.facebook_id
          this.authService.login(usuarioFb).subscribe(response => {
            localStorage.setItem('token', response.access_token);
            this.presentToast();
            this.router.navigateByUrl('home')
          })
        } else {
          let user: UsuarioFacebook = { 
            id: res.id, email: res.email, data_nascimento: res.birthday, 
            nome: res.name, password: res.id, telefone: '0000000', 
            facebook_id: res.id, avatar: res.picture.data.url
          }
          
          this.cadastraService.cadastraFb(user).subscribe(respCad => {
            console.log(respCad);
            if (respCad) {
              respCad.password = respCad.id;
              this.authService.login(respCad).subscribe(respLogin => {
                localStorage.setItem('token', respLogin.access_token);
                this.presentToast();
                this.router.navigateByUrl('home')
              })
            }
          })
        }
      })
    });
  }

  
  
  async presentToast() {
    this.spinnerLoading = false;

    const toast = await this.toastController.create({
      message: 'Login efetuado com sucesso!',
      duration: 4000
    });
    toast.present();
  }

  resetPassword()
  {
    this.router.navigateByUrl('reset-password')
  }
}
