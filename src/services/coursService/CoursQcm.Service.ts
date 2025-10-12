import { Injectable } from '@angular/core';
import { CoursApiService } from './CoursApi.Service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CoursQcmService {
  constructor(private api: CoursApiService) {}

  hasUserDoneQcm(coursId: string, userId: string): Observable<boolean> {
    return this.api.hasUserDoneQcm(coursId, userId).pipe(
      map(res => res.fait),
      catchError(() => of(false))
    );
  }
}
