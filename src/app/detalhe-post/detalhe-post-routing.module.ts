import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalhePostComponent } from './detalhe-post.component';

const routes: Routes = [
  {
    path: '',
    component: DetalhePostComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalhePostRoutingModule {}
