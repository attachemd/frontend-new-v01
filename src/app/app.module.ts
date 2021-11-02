import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AuthService} from "./services/auth.service";
import { HomeComponent } from './home/home.component';
import {AuthGuard} from "./guards/auth.guard";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthTokenInterceptors} from "./interceptors/auth.token.interceptors";
import {UserService} from "./services/user.service";
import {JwtModule} from "@auth0/angular-jwt";

export function tokenGetter(): string | null {
  return localStorage.getItem('access');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: [
          'localhost:4200', 'localhost:8000',
          // environment.host
        ],
        skipWhenExpired: false,
        // throwNoTokenError: true
      }
    }),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthTokenInterceptors,
    //   multi: true,
    // },
    AuthService,
    UserService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
