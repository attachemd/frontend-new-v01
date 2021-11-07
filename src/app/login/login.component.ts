import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    // selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})

// export class LoginComponent implements OnInit {
//     loginForm = {
//         username: '',
//         password: '',
//     };
//     data = {
//         id: '',
//         username: '',
//     };
//
//     constructor(private authService: AuthService, private router: Router) {}
//
//     ngOnInit(): void {}
//
//     userLogin() {
//         console.log('this.loginForm: ', this.loginForm);
//         // 02 LOGIN
//         this.authService.userLogin(this.loginForm).subscribe(
//             (value: any) => {
//                 // 05 LOGIN If everything looks good, redirect to the dashboard.
//                 console.log('LoginComponent userLogin value: ', value);
//                 this.data = value;
//                 if (value) {
//                     this.router.navigate(['/dashboard']);
//                 } else {
//                     console.error('failed');
//                 }
//             },
//             (error) => {
//                 console.error('failed error');
//             }
//         );
//     }
// }
export class LoginComponent implements OnInit {
    submitted = false;
    loginForm: FormGroup;
    authError = false;
    authErrorMsg: string | undefined;

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    ngOnInit(): void {}

    get f() {
        return this.loginForm.controls;
    }

    onSubmit(loginData: any) {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        const userloginBody = {
            username: loginData.username,
            password: loginData.password,
        };
        // Pending API call and logic handling
        // this.loginService.login(userloginBody)
        //     .then(() => {
        //         // Successfully login
        //         this.router.navigateByUrl('/home');
        //     })
        //     .catch((reason) => {
        //         // Failed login
        //         this.authError = true;
        //         this.authErrorMsg = reason;
        //     });

        this.authService.userLogin(userloginBody).subscribe(
            (value: any) => {
                // 05 LOGIN If everything looks good, redirect to the dashboard.
                console.log('LoginComponent userLogin value: ', value);
                // this.data = value;
                if (value) {
                    this.router.navigateByUrl('/dashboard');
                } else {
                    console.error('failed');
                }
            },
            (error) => {
                console.error('failed error');
                this.authError = true;
                this.authErrorMsg = error;
            }
        );
    }

    // userLogin() {
    //     console.log('this.loginForm: ', this.loginForm);
    //     // 02 LOGIN
    //     this.authService.userLogin(this.loginForm).subscribe(
    //         (value: any) => {
    //             // 05 LOGIN If everything looks good, redirect to the dashboard.
    //             console.log('LoginComponent userLogin value: ', value);
    //             this.data = value;
    //             if (value) {
    //                 this.router.navigate(['/dashboard']);
    //             } else {
    //                 console.error('failed');
    //             }
    //         },
    //         (error) => {
    //             console.error('failed error');
    //         }
    //     );
    // }
}
