import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { UsuarioLogin } from '../classes/usuarioLogin';
import { UserService } from '../services/user.service';

import { FacebookLogin, FacebookLoginPlugin } from '@capacitor-community/facebook-login'
import { Plugins, registerWebPlugin} from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { CadastreseService } from '../services/cadastrese.service';
import { Usuario } from '../classes/usuario';
import { UsuarioFacebook } from '../classes/usuarioFacebook';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  //Facebook
  fbLogin: FacebookLoginPlugin
  userfb: UsuarioFacebook = null;
  token = null;
  userId = null;

  formLogin: FormGroup;
  user: UsuarioLogin;
  spinnerLoading = false;
  callback;

  constructor( 
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder,
    public toastController: ToastController,
    private cadastraService: CadastreseService,
    private http: HttpClient,
    private userService: UserService
  ) {}


  // async getCurrentState() {
  //   const result = await Plugins.FacebookLogin.getCurrentAccessToken();
  //   try {
  //     console.log(result);
  //     if (result && result.accessToken) {
  //       let user = { token: result.accessToken.token, userId: result.accessToken.userId }
  //       let navigationExtras: NavigationExtras = {
  //         queryParams: {
  //           userinfo: JSON.stringify(user)
  //         }
  //       };
  //       this.router.navigate(["/home"], navigationExtras);
  //     }
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }



  ngOnInit() {
    this.criaFormulario(new UsuarioLogin())
  }

  
  async loginFb(): Promise<void> {
    const FACEBOOK_PERMISSIONS = ['public_profile', 'email', 'user_birthday'];

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
      this.userService.buscaUserFbId(res.id).subscribe(usuarioFb => {
        console.log('ufb',usuarioFb)
        if (usuarioFb) {
          usuarioFb.password = usuarioFb.facebook_id
          this.authService.login(usuarioFb).subscribe(response => {
            localStorage.setItem('token', response.access_token);
            this.presentToast();
            this.router.navigateByUrl('home')
          })
        } else {
          let user: UsuarioFacebook = { id: res.id, email: res.email, data_nascimento: res.birthday, nome: res.name, password: res.id, telefone: '0000000', facebook_id: res.id}
          this.cadastraService.cadastraFb(user).subscribe(respCad => {
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
  
  login() {
    this.spinnerLoading = true
    this.user = this.formLogin.value;

    this.authService.login(this.user).subscribe((response) => {
      if (response.access_token) {
        this.spinnerLoading = false
        localStorage.setItem('token', response.access_token);
        this.presentToast();
        this.router.navigateByUrl('home')
      }
    })
  }

  criaFormulario(userLogin: UsuarioLogin)
  {
    this.formLogin = this.fb.group({
      email: [userLogin.email],
      password: [userLogin.password]
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

//Fórmula de Haversine aplicada em PHP