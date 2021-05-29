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
  optionsSlides: any = {slidesPerView: 2, freeMode: false};

  constructor( 
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder,
    public toastController: ToastController,
    private cadastraService: CadastreseService,
    private http: HttpClient,
    private userService: UserService
  ) {}

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
    this.criaValidators();
    this.spinnerLoading = true
    this.user = this.formLogin.value;

    if (this.formLogin.invalid) {
      this.spinnerLoading = false
      return;
    }

    this.authService.login(this.user).subscribe((response) => {
      this.userService.verificado(this.user.email).subscribe(verificado => {
        if (verificado.email_verified_at) {
          if (response.access_token) {
            this.spinnerLoading = false
            localStorage.setItem('token', response.access_token);
            this.presentToast();
            this.router.navigateByUrl('home')
          }
        } else {
          this.spinnerLoading = false
          this.emailVerificadoToast();
        }
      })
    })
  }

  criaFormulario(userLogin: UsuarioLogin)
  {
    this.formLogin = this.fb.group({
      email: [userLogin.email],
      password: [userLogin.password]
    })
  }

  criaValidators()
  {
    this.formLogin = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]],
      password: [this.password, [Validators.required, Validators.minLength(8)]],
    })
  }

  get registerFormControl() {
    return this.formLogin.controls;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Login efetuado com sucesso!',
      duration: 4000
    });
    toast.present();
  }

  async emailVerificadoToast() {
    const toast = await this.toastController.create({
      message: 'Email não verificado, verifique seus e-mails!',
      duration: 7000
    });
    toast.present();
  }

  resetPassword()
  {
    this.router.navigateByUrl('reset-password')
  }

  get email()
  {
    return this.formLogin.get('email').value
  }

  get password()
  {
    return this.formLogin.get('password').value
  }

}

//F�rmula de Haversine aplicada em PHP