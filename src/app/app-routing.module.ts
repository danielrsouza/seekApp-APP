import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio-routing.module').then( m => m.InicioPageRoutingModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login-routing.module').then( m => m.LoginPageRoutingModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./components/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'cadastrese',
    loadChildren: () => import('./cadastrese/cadastre-routing.module').then( m => m.CadastresePageRoutingModule)
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
