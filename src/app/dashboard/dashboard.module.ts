import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {UserService} from "../services/user.service";

@NgModule({
  imports:[
    DashboardRoutingModule
  ],
  declarations:[
    DashboardComponent
  ],
  providers:[

  ]
})
export class DashboardModule {}
