import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { UsuarioLogin } from '../classes/usuarioLogin';
import { LoginUser } from '../interfaces/login-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  user: UsuarioLogin;
  spinnerLoading = false;

  constructor( 
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.criaFormulario(new UsuarioLogin())
  }
  
  login() {
    this.spinnerLoading = true
    this.user = this.formLogin.value;

    this.authService.login(this.user).subscribe((response) => {
      console.log(response);
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
