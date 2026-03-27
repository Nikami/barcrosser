import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import type { LoginDto, LoginResponse } from '@barcrosser/shared';
import { StorageService } from '@core/services/storage';

const TOKEN_KEY = 'auth_token';

/**
 * AuthService manages JWT authentication:
 * - Sends login request to /api/auth/login
 * - Persists JWT token in localStorage via StorageService
 * - Exposes reactive isLoggedIn signal
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  private readonly _token = signal<string | null>(this.storage.getItem(TOKEN_KEY));

  readonly isLoggedIn = computed(() => !!this._token());
  readonly token = this._token.asReadonly();

  login(dto: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', dto).pipe(
      tap((res) => {
        this._token.set(res.access_token);
        this.storage.setItem(TOKEN_KEY, res.access_token);
      })
    );
  }

  logout(): void {
    this._token.set(null);
    this.storage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return this._token();
  }
}
