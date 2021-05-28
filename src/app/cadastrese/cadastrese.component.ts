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

  constructor
  (
    private fb: FormBuilder,
    private cadastreseService: CadastreseService,
    public toastController: ToastController,
    private router: Router
  )
  {
    localStorage.clear();
  }

  ngOnInit() {
    this.criaFormulario(new Usuario())
  }

  cadastrese() {
    // Monta as validações que serão testadas ao enviar.
    this.criaValidators();

    this.spinnerLoading = true
    this.usuario = this.formCadastrese.value

    if (this.formCadastrese.invalid) {
      this.spinnerLoading = false
      return;
    }

    if (this.formCadastrese.valid) {
      this.cadastreseService.cadastra(this.usuario).subscribe(resp => {
        localStorage.setItem('CurrentUser', JSON.stringify(this.usuario));
        this.spinnerLoading = false;
        this.presentToast();
        this.router.navigateByUrl('email-confirmation')
      })
    }

  }



  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuário cadastrado com sucesso!',
      duration: 6000
    });
    toast.present();
  }

  // Validações

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

  togglePasswordFieldType(){
    this.isTextFieldType = !this.isTextFieldType;
  }

  togglePasswordFieldTypeConfirm(){
    this.isTextFieldTypeConfirm = !this.isTextFieldTypeConfirm;
  }

  criaValidators()
  {
    this.formCadastrese = this.fb.group({
      nome: [this.nome, [Validators.required, Validators.minLength(4)]],
      email: [this.email, [Validators.required, Validators.email]],
      password: [this.password, [Validators.required, Validators.minLength(8)]],
      passwordConfirm: [this.passwordConfirm, [Validators.required, Validators.minLength(8), Validators.maxLength(11)]],
      telefone: [this.telefone,[Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      data_nascimento: [this.data_nascimento, [Validators.required]]
    })
  }

  get registerFormControl() {
    return this.formCadastrese.controls;
  }

  get nome()
  {
    return this.formCadastrese.get('nome').value
  }

  get email()
  {
    return this.formCadastrese.get('email').value
  }

  get password()
  {
    return this.formCadastrese.get('password').value
  }

  get passwordConfirm()
  {
    return this.formCadastrese.get('passwordConfirm').value
  }

  get telefone()
  {
    return this.formCadastrese.get('telefone').value
  }

  get data_nascimento()
  {
    return this.formCadastrese.get('data_nascimento').value
  }




}
