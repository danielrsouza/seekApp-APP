import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacebookTelefoneComponent } from './facebook-telefone.component';

const routes: Routes = [
  {
    path: '',
    component: FacebookTelefoneComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacebookTelefoneRoutingModule {}
