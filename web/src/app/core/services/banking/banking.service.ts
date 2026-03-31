import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BankingRunDto {
  sinceDate: string; // ISO date string
}

export interface BankingRunResult {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class BankingService {
  private readonly http = inject(HttpClient);

  run(dto: BankingRunDto): Observable<BankingRunResult> {
    return this.http.post<BankingRunResult>('/api/banking/run', dto);
  }
}
