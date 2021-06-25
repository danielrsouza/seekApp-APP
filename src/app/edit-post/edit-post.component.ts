import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ToastController } from '@ionic/angular';
import { Post } from '../classes/post';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {

  formPostUpdate: FormGroup;
  postDescricao = '';
  postImagem = '';
  imageUrl;
  spinnerLoading = false;
  post = {};
  tempFilename;

  constructor(
    private fb: FormBuilder,
    private camera: Camera,
    private route: ActivatedRoute,
    private postService: PostService,
    public toastController: ToastController,
    private router: Router
  ) { 
    this.route.queryParams.subscribe(params => {
      this.post = params;
      this.postDescricao = params.descricao;
      this.postImagem = params.imagem;
      this.imageUrl = params.imagem;
      this.criaFormulario(this.postDescricao, this.postImagem)
    });
  }

  ngOnInit() {
  }


  criaFormulario(descricao, imagem)
  {
    this.formPostUpdate = this.fb.group({
      descricao: [descricao],
      imagem: [imagem],
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
      this.tempFilename = imageData.substr(imageData.lastIndexOf('/') + 1);
      const tempBaseFilesystemPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.imageUrl = base64Image;
      
     }, (err) => {
      // Handle error
     });
  }

  criaValidators()
  {
    this.formPostUpdate = this.fb.group({
      descricao: [this.descricao, Validators.required],
      imagem: [this.imageUrl, Validators.required],
    })
  }

  atualizaPost()
  {
    this.criaValidators();
    this.spinnerLoading = true

    if (this.formPostUpdate.invalid) {
      this.spinnerLoading = false;
      return;
    }

    this.postService.atualizaPost(this.formPostUpdate.value, this.post).subscribe(post => {
      this.presentToast();
      this.router.navigateByUrl('home')
      this.spinnerLoading = false;
    }, error => {
      this.errorAtualizarPost();
      this.router.navigateByUrl('home')
    })

  }

  get registerFormControl() {
    return this.formPostUpdate.controls;
  }

  
  get descricao()
  {
    return this.formPostUpdate.get('descricao').value
  }

  get imagem()
  {
    return this.formPostUpdate.get('imagem').value
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Post atualizado com sucesso!',
      duration: 6000
    });
    toast.present();
  }

  async errorAtualizarPost() {
    const toast = await this.toastController.create({
      message: 'Ocorreu um erro ao atualizar o post!',
      duration: 6000
    });
    toast.present();
  }
}
