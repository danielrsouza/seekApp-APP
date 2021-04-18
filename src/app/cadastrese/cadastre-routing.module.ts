import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastreseComponent } from './cadastrese.component';

const routes: Routes = [
  {
    path: '',
    component: CadastreseComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadastresePageRoutingModule {}
