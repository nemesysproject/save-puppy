import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { MediaDto } from '@shared/dtos';

@Injectable({
    providedIn: 'root'
})
export class MediaService extends BaseApiService {
    protected readonly endpoint = '/media';

    getByPetId(petId: string): Observable<MediaDto[]> {
        return this.http.get<MediaDto[]>(this.getFullUrl(`/pet/${petId}`))
            .pipe(catchError(this.handleError));
    }

    upload(petId: string, image: File | Blob): Observable<MediaDto> {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('petId', petId);

        return this.http.post<MediaDto>(this.getFullUrl(), formData)
            .pipe(catchError(this.handleError));
    }

    delete(id: string): Observable<any> {
        return this.http.delete<any>(this.getFullUrl(`/${id}`))
            .pipe(catchError(this.handleError));
    }
}
