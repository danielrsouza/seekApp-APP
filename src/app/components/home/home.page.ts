import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.userService.buscaUserLogado().subscribe(user => {
      localStorage.setItem('currentUser', JSON.stringify(user))
    })
  }

  cadastrapost()
  {
    this.router.navigateByUrl('cadastrapost');
  }
}
