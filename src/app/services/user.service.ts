import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) {}

    getUser() {
        // API_USER 01
        return this.http
            .get<{ username: string; id: number }>(
                '/api/user/'
            );
    }
}
