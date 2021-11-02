import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    userInfo = new BehaviorSubject({ id: 0, username: '' });

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private jwtHelper: JwtHelperService
    ) {
        console.log('auth.service!');

    }

    loadUserInfo() {
        let userdata = this.userInfo.getValue();
        if (!userdata.id) {
            const access = localStorage.getItem('access');
            // 01 - 03 LOGIN if no access do nothing
            if (access) {
                console.log('access: ', access);

                this.userService
                    .getUser()

                    .subscribe(
                        (value) => {
                            console.log(
                                '%c value!',
                                'background: #C70039; color: #fff; padding: 10px;'
                            );
                            console.log('value: ', value);
                            this.userInfo.next(value);
                        },
                        (error) => {
                            console.log('failed to load user');
                        }
                    );
            }
        }
    }

    // 03 LOGIN
    userLogin(login: any): Observable<boolean> {
        if (login && login.username && login.password) {
            console.log('userLogin(login:any):Observable<boolean>!');
            console.log('login: ', login);
            return this.http.post('api/token/access/', login).pipe(
                map((data: any) => {
                    // 04 LOGIN store the (access/refresh) and expiration date in localStorage
                    //     and decode the token then refresh the UI
                    console.log('data: ', data);
                    if (!data) {
                        return false;
                    }
                    console.log('data: ', data);
                    console.log(
                        '%c data!',
                        'background: #581845; color: #fff; padding: 10px;'
                    );
                    localStorage.setItem('access', data.access);
                    localStorage.setItem('refresh', data.refresh);
                    console.log('data: ', data);
                    const decodedUser = this.jwtHelper.decodeToken(data.access);
                    localStorage.setItem('expiration', decodedUser.exp);
                    console.log('decodedUser: ', decodedUser);
                    this.userInfo.next({
                        id: decodedUser.user_id,
                        username: login.username,
                    });
                    return true;
                }),
                catchError((error) => {
                    console.log('error');
                    return of(false);
                })
            );
        }
        return of(false);
    }

    // DOC: is access exist and is it JWT-like
    isAccessToken() {
        let access: string | any = localStorage.getItem('access');
        if (access) {
            try {
                let decodedUser = this.jwtHelper.decodeToken(access);
                console.log(
                    "decodedUser.token_type === 'access': ",
                    decodedUser.token_type === 'access'
                );
                console.log('decodedUser: ', decodedUser);
                return true;
            } catch (error) {
                console.error(
                    "The inspected token doesn't appear to be a JWT."
                );
                return false;
            }
        } else {
            return false;
        }
    }

    isAuthenticated() {
            return this.isAccessToken() ? this.isTokenAlive() : false;
    }

    isTokenAlive() {
        return !this.jwtHelper.isTokenExpired();
    }

    isRefreshToken() {}

    refreshAccessToken() {
        const payload = {
            refresh: localStorage.getItem('refresh'),
        };
        // localStorage.removeItem("access");
        console.log('payload: ', payload);
        return this.http
            .post('/api/token/refresh/', payload)
            .pipe(
                map((newTokens: any) => {
                    console.log('newTokens.access: ', newTokens.access);
                    localStorage.setItem('access', newTokens.access);
                    const decodedUser = this.jwtHelper.decodeToken(
                        newTokens.access
                    );
                    localStorage.setItem('expiration', decodedUser.exp);
                    return true;
                }),

                catchError((error: any) => {
                    console.error(error);
                    return of(false);
                })
            );

    }

    callRefershToken(payload: any) {
        return this.http.post('token/refresh/', payload);
    }
}
