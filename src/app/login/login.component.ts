import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { UsuarioLogin } from '../classes/usuarioLogin';
import { LoginUser } from '../interfaces/login-user';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UserService } from '../services/user.service';

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

  constructor( 
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private iab: InAppBrowser,
    private userService: UserService
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

  redirectAuthFb()
  {
    const browser = this.iab.create('https://seekappapi.herokuapp.com/facebook')
    browser.on('loadstart').subscribe(event => {
      this.callback = event.url.substring(26).replace(/\D/g, "");
      browser.close()
      this.userService.buscaUserFacebook(this.callback).subscribe(resp => {
        console.log('eeee', resp);
        this.router.navigateByUrl('callback?'+resp.email)
       // this.router.navigate(['callback?'+resp.email], {
        //  queryParams: resp
       // });
      })

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