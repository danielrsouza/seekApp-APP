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
    path: 'cadastrapost',
    loadChildren: () => import('./cadastrapost/cadastrapost-routing.module').then( m => m.CadastraPostPageRoutingModule)
  },
  {
    path: 'detalhepost',
    loadChildren: () => import('./detalhe-post/detalhe-post-routing.module').then( m => m.DetalhePostRoutingModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil/perfil.module').then( m => m.PerfilRoutingModule)
  },
  {
    path: 'callback',
    loadChildren: () => import('./callback/callback/callback.module').then( m => m.CallbackModule)
  },
  {
    path: 'email-confirmation',
    loadChildren: () => import('./email-confirmation/email-confirmation-routing.module').then( m => m.EmailConfirmationRoutingModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password-routing.module').then( m => m.ResetPasswordRoutingModule)
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
