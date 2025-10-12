import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CoursRefreshService {
  private refreshSubject = new Subject<void>();
  refreshRequested$ = this.refreshSubject.asObservable();

  demanderRafraichissement() {
    this.refreshSubject.next();
  }
}

