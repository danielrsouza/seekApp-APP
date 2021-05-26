import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { timer } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  formResetPassowrd: FormGroup;
  email;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.criaFormulario(this.email)
  }

  criaFormulario(email)
  {
    this.formResetPassowrd = this.fb.group({
      email: email
    })
  }

  reset()
  {
    this.email = this.formResetPassowrd.value.email
    this.authService.resetPassword(this.email).subscribe(resp => {
      console.log(resp);
    })
  }

}
