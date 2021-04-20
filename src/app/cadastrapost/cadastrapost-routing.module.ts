import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastrapostComponent } from './cadastrapost.component';

const routes: Routes = [
  {
    path: '',
    component: CadastrapostComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadastraPostPageRoutingModule {}
