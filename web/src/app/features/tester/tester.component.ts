import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { TesterResponse } from '@barcrosser/shared';
import { TesterService } from '@core/services/tester';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-tester',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tester.component.html',
  styleUrl: './tester.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TesterComponent {
  private readonly testerService = inject(TesterService);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = new FormGroup({
    value: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });

  readonly isLoading = signal(false);
  readonly response = signal<TesterResponse | null>(null);
  readonly errorMessage = signal<string | null>(null);

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
