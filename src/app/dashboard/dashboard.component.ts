import {Component, DoCheck, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, DoCheck {

  public loading: string | null = ""
  userName:string = '';
  constructor(private authService:AuthService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.authService.userInfo.subscribe(value => {
      if (value) {
        console.log("%c ALERT ", 'background: red; color: #fff; padding: 10px;');
        console.log('value: ', value);
        this.userName = value.username;
      } else {
        console.log('no value any way!');
      }

    })
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getUser()

      .subscribe(
        (value) => {
          console.log("%c value! ", 'background: #C70039; color: #fff; padding: 10px;')
          console.log("value: ", value)
          this.authService.userInfo.next(value);
        },
        (error) => {
          console.log('failted to load user')
        }
      )
  }

  ngDoCheck(){
    // this.loading = localStorage.getItem('access');
    // console.log("ngDoCheck this.loading: ", this.loading);
    // console.log("this.authService.userInfo.getValue(): ", this.authService.userInfo.getValue());
  }

  logout(){
    localStorage.removeItem("access");
  }

}
