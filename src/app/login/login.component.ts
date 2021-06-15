import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { UsuarioLogin } from '../classes/usuarioLogin';
import { UserService } from '../services/user.service';


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

    private userService: UserService
  ) {}

  ngOnInit() {
    this.criaFormulario(new UsuarioLogin())
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
    }, error => {
      console.log(error.error.message);
      this.spinnerLoading = false
      this.senhaIncorretaToast();
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

  async senhaIncorretaToast() {
    const toast = await this.toastController.create({
      message: 'Email ou senha não encontrados em nossa base de dados!',
      duration: 7000
    });
    toast.present();
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