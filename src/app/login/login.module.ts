import { NgModule } from "@angular/core";
import { LoginComponent } from './login.component';
import { LoginRouteModules } from './login-route.module';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";

@NgModule({
  declarations:[
    LoginComponent
  ],
  imports: [
    LoginRouteModules,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule
  ]
})
export class LoginModule{}
