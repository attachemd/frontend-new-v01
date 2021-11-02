import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  // 01 REFRESH_MODIF_ACCESS_EXP case when refresh token modified
  //     and access token expired
  // 01 NEW_ENTER redirect to login
  {
    path:'',
    redirectTo:'login',
    pathMatch: 'full'
  },
  {
    path:'login',
    loadChildren:() => import('./login/login.module').then(_ => _.LoginModule),
    canActivate: [AuthGuard]
  },
  {
    // 01 DASHBOARD_ROUTE
    path:'dashboard',
    loadChildren:() => import('./dashboard/dashboard.module').then(_ => _.DashboardModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
