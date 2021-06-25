import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../classes/usuario';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss'],
})
export class PerfilUsuarioComponent implements OnInit {

  userPerfil: Usuario;

  constructor(
    public toastController: ToastController,
    private router: Router, 
  ) { }

  ngOnInit() {
    this.userPerfil = JSON.parse(localStorage.getItem('currentUser'));
  }

  async logoutToast() {
    const toast = await this.toastController.create({
      message: 'Logout feito com sucesso!',
      duration: 6000
    });
    toast.present();
  }

  logout()
  {
    localStorage.clear();
    sessionStorage.clear();
    this.logoutToast();
    this.router.navigateByUrl('inicio');
  }

  home()
  {
    this.router.navigateByUrl('home');
  }

}
