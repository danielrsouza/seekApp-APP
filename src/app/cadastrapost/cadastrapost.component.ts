import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ToastController } from '@ionic/angular';
import { Post } from '../classes/post';
import { Usuario } from '../classes/usuario';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-cadastrapost',
  templateUrl: './cadastrapost.component.html',
  styleUrls: ['./cadastrapost.component.scss'],
})
export class CadastrapostComponent implements OnInit {

  formPost: FormGroup;
  post: Post;
  spinnerLoading = false;
  currentUser: Usuario
  imageUrl;
  tempFilename;
  tempBaseFilesystemPath;
  spinnerLoadingImg = false;

  constructor(    
    private fb: FormBuilder,
    public toastController: ToastController,
    private router: Router,
    private postService: PostService,
    private camera: Camera,
  ) {}

  ngOnInit() {
    this.criaFormulario(new Post())
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  persistPost()
  {
    this.spinnerLoading = true
    this.criaValidators();
    this.post = this.formPost.value

    if (this.formPost.invalid) {
      this.spinnerLoading = false;
      return;
    }

    this.post.id_usuario = this.currentUser.id;
    this.post.imagem = this.imageUrl;

    this.postService.cadastra(this.post).subscribe(post => {
      console.log('botão de cadastra apertado')
      this.presentToast();
      this.router.navigateByUrl('home');
      this.spinnerLoading = false;
    }, error => {
      this.errorCadastrarPost();
      this.router.navigateByUrl('home');
    })

  }

  abriGaleria()
  {
    this.spinnerLoadingImg = true;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.tempFilename = imageData.substr(imageData.lastIndexOf('/') + 1);
      this.tempBaseFilesystemPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);

      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageUrl = base64Image;
      this.spinnerLoadingImg = false;
      
     }, (err) => {
      this.errorGaleria(err.error.message);
      this.router.navigateByUrl('home');
      this.spinnerLoadingImg = false;
     });
  }


  criaFormulario(post: Post)
  {
    this.formPost = this.fb.group({
      descricao: [post.descricao],
      imagem: [this.imageUrl],
    });
  }

  criaValidators()
  {
    this.formPost = this.fb.group({
      descricao: [this.descricao, Validators.required],
      imagem: [this.imageUrl, Validators.required],
    });
  }

  get registerFormControl() {
    return this.formPost.controls;
  }

  
  get descricao()
  {
    return this.formPost.get('descricao').value
  }

  get imagem()
  {
    return this.formPost.get('imagem').value
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Post cadastrado com sucesso!',
      duration: 6000
    });
    toast.present();
  }

  async errorCadastrarPost() {
    const toast = await this.toastController.create({
      message: 'Ocorreu um erro ao cadastrar o post!',
      duration: 6000
    });
    toast.present();
  }

  async errorGaleria(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 6000
    });
    toast.present();
  }
}
