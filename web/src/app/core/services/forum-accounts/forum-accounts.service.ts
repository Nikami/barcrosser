import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import type { ForumAccountDto, UpsertForumAccountDto } from '@barcrosser/shared';

@Injectable({ providedIn: 'root' })
export class ForumAccountsService {
  private readonly http = inject(HttpClient);

  readonly accounts = signal<ForumAccountDto[]>([]);

  load(): Observable<ForumAccountDto[]> {
    return this.http.get<ForumAccountDto[]>('/api/forum-accounts').pipe(
      tap((list) => this.accounts.set(list)),
    );
  }

  upsert(dto: UpsertForumAccountDto): Observable<ForumAccountDto> {
    return this.http.post<ForumAccountDto>('/api/forum-accounts', dto);
  }

  toggleActive(id: string): Observable<ForumAccountDto> {
    return this.http.patch<ForumAccountDto>(`/api/forum-accounts/${id}/toggle`, {});
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`/api/forum-accounts/${id}`);
  }
}
