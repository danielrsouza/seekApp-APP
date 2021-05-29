import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../classes/usuario';
import { CadastreseService } from '../services/cadastrese.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

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
  imageUrl;

  constructor
  (
    private fb: FormBuilder,
    private cadastreseService: CadastreseService,
    public toastController: ToastController,
    private router: Router,
    private camera: Camera,
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
      if (this.imageUrl) {
        this.usuario.avatar = this.imageUrl;
      }
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

  abriGaleria()
  {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageUrl = base64Image;
      
     }, (err) => {
      // Handle error
     });
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
