import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 10
  };

  constructor(
    private router: Router
  ) {}

  ngOnInit() {}


  cadastrese() {
    this.router.navigateByUrl('cadastrese')
  }

  login() {
    this.router.navigateByUrl('login')
  }
}
