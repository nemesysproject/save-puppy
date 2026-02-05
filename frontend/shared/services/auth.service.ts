import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import {
    AuthResponseDto,
    LoginDto,
    RegisterDto,
    RefreshTokenDto,
    LogoutDto
} from '@shared/dtos';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseApiService {
    protected readonly endpoint = '/auth';

    login(credentials: LoginDto): Observable<AuthResponseDto> {
        return this.http.post<AuthResponseDto>(this.getFullUrl('/login'), credentials)
            .pipe(catchError(this.handleError));
    }

    register(user: RegisterDto): Observable<any> {
        return this.http.post<any>(this.getFullUrl('/register'), user)
            .pipe(catchError(this.handleError));
    }

    refreshToken(data: RefreshTokenDto): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(this.getFullUrl('/refresh-token'), data)
            .pipe(catchError(this.handleError));
    }

    logout(data?: LogoutDto): Observable<any> {
        return this.http.post<any>(this.getFullUrl('/logout'), data || {})
            .pipe(catchError(this.handleError));
    }
}
