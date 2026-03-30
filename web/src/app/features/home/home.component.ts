import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@shared/shared.module';
import type { TesterResponse } from '@barcrosser/shared';
import { TesterService } from '@core/services/tester';
import { AuthService } from '@core/services/auth/auth.service';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly testerService = inject(TesterService);
  private readonly snackBar = inject(MatSnackBar);
  readonly authService = inject(AuthService);

  readonly form = new FormGroup({
    value: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });

  readonly isLoading = signal(false);
  readonly response = signal<TesterResponse | null>(null);
  readonly errorMessage = signal<string | null>(null);

  login(): void {
    this.authService.login({ username: 'testuser', password: 'testpass123' }).subscribe({
      next: () => this.snackBar.open('Logged in as testuser', 'Close', { duration: 3000 }),
      error: () => this.snackBar.open('Login failed!', 'Close', { duration: 3000 }),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.response.set(null);

    this.testerService.submit({ value: this.form.controls.value.value }).subscribe({
      next: (res) => {
        this.response.set(res);
        this.isLoading.set(false);
        this.snackBar.open('Success!', 'Close', { duration: 3000 });
      },
      error: (err: { message?: string }) => {
        this.errorMessage.set(err?.message ?? 'Something went wrong');
        this.isLoading.set(false);
      },
    });
  }
}
