import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    // selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    loginForm = {
        username: '',
        password: '',
    };

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {}

    userLogin() {
        console.log('this.loginForm: ', this.loginForm);
        // 02 LOGIN
        this.authService.userLogin(this.loginForm).subscribe(
            (value: any) => {
                // 05 LOGIN If everything looks good, redirect to the dashboard.
                console.log('LoginComponent userLogin value: ', value);
                if (value) {
                    this.router.navigate(['/dashboard']);
                } else {
                    console.error('failed');
                }
            },
            (error) => {
                console.error('failed error');
            }
        );
    }
}
