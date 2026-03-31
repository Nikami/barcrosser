import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, type FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@shared/shared.module';
import { finalize } from 'rxjs';
import { SharedModule } from '@shared/shared.module';
import { HeaderComponent, FooterComponent } from '@shared/components';
import { BankingService } from '@core/services/banking/banking.service';
import { ForumAccountsService } from '@core/services/forum-accounts/forum-accounts.service';
import type { ForumAccountDto } from '@barcrosser/shared';


@Component({
  selector: 'app-banking',
  standalone: true,
  imports: [SharedModule, HeaderComponent, FooterComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './banking.component.html',
  styleUrls: ['./banking.component.scss'],
})
export class BankingComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly banking = inject(BankingService);
  private readonly snack = inject(MatSnackBar);
  readonly accountsService = inject(ForumAccountsService);

  readonly running = signal(false);
  readonly resultMessage = signal<string | null>(null);
  readonly loadingAccounts = signal(false);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      sinceDate: [null, Validators.required],
    });
    this.loadingAccounts.set(true);
    this.accountsService
      .load()
      .pipe(finalize(() => this.loadingAccounts.set(false)))
      .subscribe({
        error: (err: { message: string }) =>
          this.snack.open(`Failed to load accounts: ${err.message}`, 'Close', { duration: 4000 }),
      });
  }

  get activeAccounts(): ForumAccountDto[] {
    return this.accountsService.accounts().filter((a) => a.isActive);
  }

  runBanking(): void {
    if (this.form.invalid) return;
    this.running.set(true);
    this.resultMessage.set(null);

    const rawDate = this.form.value.sinceDate as Date;
    const sinceDate = rawDate.toISOString().split('T')[0];

    this.banking
      .run({ sinceDate })
      .pipe(finalize(() => this.running.set(false)))
      .subscribe({
        next: (res) => {
          this.resultMessage.set(res.message);
          this.snack.open(res.message, 'Close', { duration: 5000 });
        },
        error: (err: { error?: { message?: string }; message?: string }) => {
          const msg = err.error?.message ?? err.message ?? 'Unknown error';
          this.resultMessage.set(`Error: ${msg}`);
          this.snack.open(`Banking failed: ${msg}`, 'Close', { duration: 6000 });
        },
      });
  }
}
