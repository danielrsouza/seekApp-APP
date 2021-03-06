import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../classes/usuario';
import { CadastreseService } from '../services/cadastrese.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UserService } from '../services/user.service';

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
  tempFilename;
  tempBaseFilesystemPath;
  spinnerLoadingImg = false;
  mostraErro = false;
  mostraErroImagem = false;

  constructor
  (
    private fb: FormBuilder,
    private cadastreseService: CadastreseService,
    public toastController: ToastController,
    private router: Router,
    private camera: Camera,
    private userService: UserService
  ) { 
      localStorage.clear();
    }

  ngOnInit() {
    this.criaFormulario(new Usuario())
  }

  cadastrese() {
    if (!this.telefone) {
      this.mostraErro = true;
    } else {
      this.mostraErro = false;
    }
    // Monta as validações que serão testadas ao enviar.
    this.criaValidators();

    if (!this.imageUrl) {
      this.mostraErroImagem = true;
    } else {
      this.mostraErroImagem = false;
    }

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
      this.userService.exist(this.usuario.email).subscribe(exist => {
        if (exist.success) {
          this.errorExist();
          this.router.navigateByUrl('inicio');
          return false;
        }
        this.cadastreseService.cadastra(this.usuario).subscribe( () => {
          localStorage.setItem('CurrentUser', JSON.stringify(this.usuario));
          this.spinnerLoading = false;
          this.presentToast();
          this.router.navigateByUrl('email-confirmation')
        }, error => {
          this.errorToast("Erro ao cadastrar");
          this.spinnerLoading = false;
          this.router.navigateByUrl('cadastrese')
        });
      },  error => {
        this.errorToast(error.error.message);
        this.spinnerLoading = false;
      });

    }

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuário cadastrado com sucesso!',
      duration: 6000
    });
    toast.present();
  }

  async errorToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 6000
    });
    toast.present();
  }

  async errorExist() {
    const toast = await this.toastController.create({
      message: 'Esse e-mail já está cadastrado!',
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
      data_nascimento: [this.data_nascimento, [Validators.required]],
      telefone: [this.telefone, ],
      imagem: [this.imageUrl],
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



  async abriGaleria()
  {
    this.spinnerLoadingImg = true;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.tempFilename = imageData.substr(imageData.lastIndexOf('/') + 1);
      this.tempBaseFilesystemPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);

      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageUrl = base64Image;
      this.spinnerLoadingImg = false;

      if (this.imageUrl) {
        this.mostraErroImagem = false;
      } else {
        this.mostraErroImagem = true;
      }
    
      
     }, (err) => {
      this.spinnerLoadingImg = false;
      this.errorGaleria(err.error.message);
      this.router.navigateByUrl('inicio');
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

  async errorGaleria(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 6000
    });
    toast.present();
  }




}
