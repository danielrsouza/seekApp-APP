import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginPlugin } from '@capacitor-community/facebook-login'
import { Plugins} from '@capacitor/core';
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

  optionsSlides: any = {slidesPerView: 2, freeMode: false};

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

    const result = await Plugins.FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS }).catch(error => this.erroCatch(error.message));

    if (result && result.accessToken) {
      this.token = result.accessToken.token
      this.userId = result.accessToken.userId
      this.carregaDadosUserFb()
    }else {
      this.erroLoginFb();
      this.router.navigateByUrl('login');
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
            }, error => {
              this.erroCatch(error.message);
              this.router.navigateByUrl('home');
            })
        } else {

          this.userService.exist(res.email).subscribe(exist => {
            if (exist) {
              this.emailFacebookExiste();
              this.router.navigateByUrl('login');
              return false;
            }
              let user: UsuarioFacebook = { 
                id: res.id, email: res.email, data_nascimento: '00/00/0000', 
                nome: res.name, password: res.id, telefone: '0000000', 
                facebook_id: res.id, avatar: res.picture.data.url
              }
              
              this.cadastraService.cadastraFb(user).subscribe(respCad => {
                if (respCad) {
                    respCad.password = respCad.id;
                    this.authService.login(respCad).subscribe(respLogin => {
                      localStorage.setItem('token', respLogin.access_token);
                      this.presentToast();
                      this.router.navigateByUrl('login')
                    }, error => {
                      this.erroCatch(error.message);
                      this.router.navigateByUrl('login');
                    })
                } // fim IF
              })
          })
        } // fim ELSE
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

  async erroLoginFb() {
    this.spinnerLoading = false;

    const toast = await this.toastController.create({
      message: 'Erro no login!',
      duration: 4000
    });
    toast.present();
  }

  async erroCatch(message) {
    this.spinnerLoading = false;

    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

  async emailFacebookExiste() {
    this.spinnerLoading = false;

    const toast = await this.toastController.create({
      message: "O email do facebook já existe em nossa base!",
      duration: 4000
    });
    toast.present();
  }

  resetPassword()
  {
    this.router.navigateByUrl('reset-password')
  }
}
