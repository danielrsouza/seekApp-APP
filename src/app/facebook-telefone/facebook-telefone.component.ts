import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { Usuario } from '../classes/usuario';

@Component({
  selector: 'app-facebook-telefone',
  templateUrl: './facebook-telefone.component.html',
  styleUrls: ['./facebook-telefone.component.scss'],
})
export class FacebookTelefoneComponent implements OnInit {

  formFacebookTelefone: FormGroup;
  telefone;
  spinnerLoading = false;
  mostraErro = false;
  email;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public toastController: ToastController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.criaFormulario(this.telefone)
  }

  criaFormulario(telefone)
  {
    this.formFacebookTelefone = this.fb.group({
      telefone: telefone
    })
  }

  updateTelefone()
  {

    const currentUser: Usuario = JSON.parse(localStorage.getItem('currentUser'));
    this.spinnerLoading = true
    this.telefone = this.formFacebookTelefone.value.telefone
    this.email = currentUser.email;
    if (!this.telefone) {
      this.mostraErro = true;
      this.spinnerLoading = false;
      return false;
    } else {
      this.mostraErro = false;
    }
    this.authService.complementaDadosFacebook(this.email, this.telefone).subscribe((resp) => {
      localStorage.setItem('currentUser', JSON.stringify(resp.user));
      this.atualizadoToast();
      this.spinnerLoading = false;
      this.router.navigateByUrl('home');
    }, erro => {
      console.log(erro);
      this.errorToast();
      this.router.navigateByUrl('inicio');
    })
   
  }

  mudaStatusErro()
  {
    if(this.telefone) {
      this.mostraErro = false;
    } else {
      this.mostraErro = true;
    }
  }

  async atualizadoToast() {
    const toast = await this.toastController.create({
      message: 'Dados complementados com sucesso!',
      duration: 4000
    });
    toast.present();
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: 'Algum erro ocorreu!',
      duration: 4000
    });
    toast.present();
  }

}
