import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UsuarioLogin } from '../classes/usuarioLogin';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss'],
})
export class EmailConfirmationComponent implements OnInit {

  emailResend = localStorage.getItem('emailCadastro');
  constructor(
    private authService: AuthService, 
    public toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}

  reenviaEmail()
  {
    let userCadastrado = JSON.parse(localStorage.getItem('CurrentUser'));
    let userLogin = {
      email: userCadastrado.email,
      password: userCadastrado.password
    }
    
    this.authService.login(userLogin).subscribe(respostaLogin => {
      localStorage.setItem('token', respostaLogin.access_token);
      this.authService.reenviarEmail(userLogin.email).subscribe(resp => {
        this.reenvioToast();
      })
    })
  }

  telaLogin()
  {
    this.router.navigateByUrl('login')
  }

  async reenvioToast() {
    const toast = await this.toastController.create({
      message: 'E-mail de verificação reenviado!',
      duration: 6000
    });
    toast.present();
  }

}
