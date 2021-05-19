import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../classes/usuario';
import { CadastreseService } from '../services/cadastrese.service';

@Component({
  selector: 'app-cadastrese',
  templateUrl: './cadastrese.component.html',
  styleUrls: ['./cadastrese.component.scss'],
})

export class CadastreseComponent implements OnInit   {
  formCadastrese: FormGroup;
  usuario: Usuario
  spinnerLoading = false;
  isTextFieldType: boolean;
  isTextFieldTypeConfirm: boolean;

  constructor(
    private fb: FormBuilder,
    private cadastreseService: CadastreseService,
    public toastController: ToastController,
    private router: Router
    ) { }

  ngOnInit() {
    this.criaFormulario(new Usuario())
  }

  cadastrese() {
    this.spinnerLoading = true
    this.usuario = this.formCadastrese.value

    this.cadastreseService.cadastra(this.usuario).subscribe(resp => {
      this.spinnerLoading = false;
      this.presentToast();
      this.router.navigateByUrl('login')
    })
  }

  togglePasswordFieldType(){
    this.isTextFieldType = !this.isTextFieldType;
  }

  togglePasswordFieldTypeConfirm(){
    this.isTextFieldTypeConfirm = !this.isTextFieldTypeConfirm;
  }

  criaFormulario(usuario: Usuario)
  {
    this.formCadastrese = this.fb.group({
      nome: [usuario.nome],
      email: [usuario.email],
      password: [usuario.password],
      passwordConfirm: [usuario.password],
      telefone: [usuario.telefone],
      data_nascimento: [usuario.data_nascimento]
    })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuário cadastrado com sucesso!',
      duration: 6000
    });
    toast.present();
  }

}
