import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { TesterDto, TesterResponse } from '@barcrosser/shared';

/**
 * TesterService sends the tester form value to the backend.
 * Requires a valid JWT token (attached automatically by AuthInterceptor).
 */
@Injectable({ providedIn: 'root' })
export class TesterService {
  private readonly http = inject(HttpClient);

  submit(dto: TesterDto): Observable<TesterResponse> {
    return this.http.post<TesterResponse>('/api/tester', dto);
  }
}
