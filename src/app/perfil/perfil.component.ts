import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from '../classes/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  userPerfil;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userPerfil = params
    });
  }

}
