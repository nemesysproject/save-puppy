import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export abstract class BaseApiService {
    protected http = inject(HttpClient);
    protected abstract readonly endpoint: string;
    protected baseUrl = 'http://localhost:3000/api'; // This could be injected via an InjectionToken in the future

    protected getFullUrl(path: string = ''): string {
        return `${this.baseUrl}${this.endpoint}${path}`;
    }

    protected getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
        });
    }

    protected handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = (error.error && error.error.message) || (error.error && error.error.error) || error.message;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
