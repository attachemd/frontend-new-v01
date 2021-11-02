import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpClient,
    HttpResponse,
    HttpParams,
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SampleService } from '../services/sample.service';

@Injectable()
export class AuthTokenInterceptors implements HttpInterceptor {
    jwtHelper = new JwtHelperService();

    constructor(private http: HttpClient, private router: Router) {
        console.log('constructor auth.token.interceptors new');
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        console.log('interceptor ENTER');

        console.log(
            '%c req url ',
            'background: green; color: #fff; padding: 0 10px;'
        );
        console.log('*** ' + req.url + ' ***');
        console.log('request namespace : ', req.params.get('namespace'));
        console.log('*** req url end ***');
        console.log(
            '%c debugger! ',
            'background: orange; color: #000; padding: 0 10px;'
        );
        // debugger;
        // DOC: prevent refresh loop
        if (req.url.indexOf('token/refresh') > -1) {
            console.log('stop refreshing here!');
            console.log(req.url);
            return next.handle(req);
        }
        console.log('no token refresh request');
        if (req.url.indexOf('token/access') > -1) {
            // 04 - 01 LOGIN return this request without further processing.
            console.log('stop token/access here');
            return next.handle(req);
        }
        console.log('no token access request');
        const access = localStorage.getItem('access');
        console.log('access: ', access);
        console.log('refresh: ', localStorage.getItem('refresh'));

        // DOC: if no access return the request as it is
        if (access) {
            console.log(
                '%c debugger! ',
                'background: orange; color: #000; padding: 0 10px;'
            );
            // debugger;
            // 03 - 01 DASHBOARD_ROUTE if token is alive
            //          and complete the authentication by injecting Authorization access token
            //          if not proceed to refresh the access token
            if (this.checkTokenIfAlive('inside access')) {
                return this.bearerAuthorization(
                    req,
                    next,
                    access,
                    'inside_access'
                );
            }

            const payload = {
                refresh: localStorage.getItem('refresh'),
            };

            console.log('refresh: start refresh request', payload.refresh);

            // 03 REFRESH_MODIF_ACCESS_EXP make error
            return this.http
                .post('/api/token/refresh/', payload)
                .pipe(
                    switchMap((newTokens: any) => {
                        // DOC: if access token alive make sure that authentication fire once
                        //  if not proceed to store the new access token
                        console.log(
                            '%c switchMap start! ',
                            'background: red; color: #fff; padding: 0 100px;'
                        );
                        console.log('### ' + req.url + ' ###');
                        console.log(
                            'request namespace : ',
                            req.params.get('namespace')
                        );
                        if (this.checkTokenIfAlive('inside switchMap')) {
                            return this.bearerAuthorization(
                                req,
                                next,
                                localStorage.getItem('access')!,
                                'switchMap_start'
                            );
                        } else {
                            console.log('skipped!');
                        }

                        console.log(
                            '%c req url ',
                            'background: yellow; color: #000; padding: 10px;'
                        );
                        console.log('*** ' + req.url + ' ***');
                        console.log(
                            'request namespace : ',
                            req.params.get('namespace')
                        );
                        console.log('*** req url end ***');

                        console.log('access token generated');
                        console.log('newTokens.access: ', newTokens.access);

                        localStorage.setItem('access', newTokens.access);
                        const decodedUser = this.jwtHelper.decodeToken(
                            newTokens.access
                        );
                        localStorage.setItem('expiration', decodedUser.exp);

                        console.log('refresh and stop');

                        // DOC: new authorization
                        const transformedReq = req.clone({
                            headers: req.headers.set(
                                'Authorization',
                                `Bearer ${newTokens.access}`
                            ),
                            params: (req.params
                                ? req.params
                                : new HttpParams()
                            ).set(
                                'context',
                                'switchMap_end'
                            ) /*.... add new params here .....*/,
                        });
                        console.log(
                            "transformedReq.params.get('context'): ",
                            transformedReq.params.get('context')
                        );
                        console.log('final touch');
                        return next.handle(transformedReq);
                    }),

                    catchError((error) => {
                        // localStorage.setItem('access', "");
                        // return next.handle(req);
                        console.error(error);
                        console.error(error.headers);
                        console.log(
                            '%c refresh ',
                            'background: red; color: #fff; padding: 0 10px;'
                        );
                        console.log('req.url: ', req.url);
                        console.log('access: ', localStorage.getItem('access'));
                        console.log(
                            'refresh: ',
                            localStorage.getItem('refresh')
                        );
                        // debugger;
                        if (error.url.indexOf('token/refresh') > -1) {
                            console.log('yes token/refresh!');
                            // 04 REFRESH_MODIF_ACCESS_EXP reset access
                            //  and pass the error
                            localStorage.removeItem('access');
                        }
                        console.log(
                            '%c return next.handle(req) error ',
                            'background: gray; color: #fff; padding: 0 10px;'
                        );

                        return next.handle(req);
                    })
                );
        } else {
            console.log(
                '%c return next.handle(req) no access ',
                'background: gray; color: #fff; padding: 0 10px;'
            );
            return next.handle(req);
        }
    }

    bearerAuthorization(
        req: HttpRequest<any>,
        next: HttpHandler,
        access: string,
        context: string
    ): Observable<HttpEvent<any>> {
        req.params.set('context', context);
        const transformedReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${access}`),
            params: (req.params ? req.params : new HttpParams()).set(
                'context',
                context
            ),
        });

        return next.handle(transformedReq);
    }

    checkTokenIfAlive(context: string): boolean {
        const expiration = localStorage.getItem('expiration');
        if (Date.now() < Number(expiration) * 1000) {
            console.log('token alive ' + context);
            return true;
        } else {
            console.log('token expired');
            return false;
        }
    }
}
