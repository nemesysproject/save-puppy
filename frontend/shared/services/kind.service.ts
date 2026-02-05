import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { KindDto } from '@shared/dtos';

@Injectable({
    providedIn: 'root'
})
export class KindService extends BaseApiService {
    protected readonly endpoint = '/kinds';

    getKinds(): Observable<KindDto[]> {
        return this.http.get<KindDto[]>(this.getFullUrl())
            .pipe(catchError(this.handleError));
    }
}
