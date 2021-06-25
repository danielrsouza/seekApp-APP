import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { timer } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  formResetPassowrd: FormGroup;
  email;
  spinnerLoading = false;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public toastController: ToastController,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.criaFormulario(this.email)
  }

  criaFormulario(email)
  {
    this.formResetPassowrd = this.fb.group({
      email: email
    })
  }

  reset()
  {
    this.spinnerLoading = true
    this.email = this.formResetPassowrd.value.email
    this.userService.exist(this.email).subscribe(exist => {
      if (exist.success) {
        this.authService.resetPassword(this.email).subscribe(resp => {
          this.spinnerLoading = false
          this.resetToast();
          this.router.navigateByUrl('login')
        }, (error) => {
          this.emailNaoExisteToast();
        this.spinnerLoading = false
    })
      } else {
        this.emailNaoExisteToast();
        this.spinnerLoading = false
      }
    }, (error) => {
      this.emailNaoExisteToast();
      this.spinnerLoading = false
    }) 

  }

  async resetToast() {
    const toast = await this.toastController.create({
      message: 'Email de redefinição de senha enviado com sucesso!',
      duration: 4000
    });
    toast.present();
  }

  async emailNaoExisteToast() {
    const toast = await this.toastController.create({
      message: 'Email não cadastrado em nossa base de dados!',
      duration: 4000
    });
    toast.present();
  }

  async errorMessage(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

}
