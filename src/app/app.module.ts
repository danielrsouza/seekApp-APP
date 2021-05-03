import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { CadastreseComponent } from './cadastrese/cadastrese.component';
import { LoginModule } from './login/login/login.module';
import { CadastreseModule } from './cadastrese/cadastrese/cadastrese.module';
import { TokenInterceptor } from './auth/token.interceptor';
import { CadastrapostComponent } from './cadastrapost/cadastrapost.component';
import { DetalhePostComponent } from './detalhe-post/detalhe-post.component';
import { DetalhePostModule } from './detalhe-post/detalhe-post/detalhe-post.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { PerfilComponent } from './perfil/perfil.component';
import { PerfilRoutingModule } from './perfil/perfil/perfil.module';

@NgModule({
  declarations: [AppComponent, LoginComponent, CadastreseComponent, CadastrapostComponent, DetalhePostComponent, PerfilComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), 
            AppRoutingModule, HttpClientModule, 
            ReactiveFormsModule, CommonModule, 
            LoginModule, CadastreseModule, 
            FormsModule, DetalhePostModule, PerfilRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    Geolocation,
    PhotoLibrary,
    Camera 
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
