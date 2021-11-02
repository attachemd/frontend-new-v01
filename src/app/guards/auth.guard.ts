import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { myTypeModel } from './my-type.model';

@Injectable()
export class AuthGuard implements CanActivate {
    // firstProp: string = "";
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | boolean
        | UrlTree
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree> {
        if (this.authService.isAuthenticated()) {
            return this.tokenProcessing(state, 'userService', 'getUser');
        } else {
            if (localStorage.getItem('access')) {
                return this.tokenProcessing(
                    state,
                    'authService',
                    'refreshAccessToken'
                );
            } else {
                // DOC redirect to login
                if (state.url.indexOf('/login') == -1) {
                    this.router.navigate(['/login']);
                    return of(false);
                } else {
                    return of(true);
                }
            }
        }
    }

    tokenProcessing(
        state: RouterStateSnapshot,
        firstMethod: string,
        secondMethod: string
    ) {
        return (this as any)[firstMethod][secondMethod]().pipe(
            map((userData) => {
                if (userData) {
                    return this.redirectToDashboard(state);
                } else {
                    return this.redirectToLogin(state);
                }
            }),
            catchError((error) => {
                console.log('from auth.guard.ts error: ', error);
                this.router.navigate(['/login']);
                return of(false);
            })
        );
    }

    redirectToLogin(state: RouterStateSnapshot): boolean {
        if (state.url.indexOf('/login') == -1) {
            // DOC: not logged in users only navigate to login page
            this.router.navigate(['/login']);
            return false;
        } else {
            return true;
        }
    }

    redirectToDashboard(state: RouterStateSnapshot): boolean {
        if (state.url.indexOf('/login') != -1) {
            this.router.navigate(['/dashboard']);
            return false;
        } else {
            return true;
        }
    }
}
