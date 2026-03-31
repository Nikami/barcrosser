import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, type FormArray, type FormGroup, Validators } from '@angular/forms';



import { MatSnackBar } from '@shared/shared.module';
import { finalize } from 'rxjs';
import { SharedModule } from '@shared/shared.module';
import { HeaderComponent, FooterComponent } from '@shared/components';
import { ForumAccountsService } from '@core/services/forum-accounts/forum-accounts.service';
import type { ForumAccountDto } from '@barcrosser/shared';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SharedModule, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);
  readonly accountsService = inject(ForumAccountsService);

  readonly loading = signal(false);
  readonly saving = signal(false);

  readonly displayedColumns = ['name', 'status', 'createdAt', 'actions'];

  form!: FormGroup;

  get entries(): FormArray {
    return this.form.get('entries') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      entries: this.fb.array([this.buildEntry()]),
    });
    this.loadAccounts();
  }

  private buildEntry(name = '', password = ''): FormGroup {
    return this.fb.group({
      name: [name, [Validators.required, Validators.minLength(1)]],
      password: [password, [Validators.required, Validators.minLength(1)]],
    });
  }

  addEntry(): void {
    this.entries.push(this.buildEntry());
  }

  removeEntry(index: number): void {
    if (this.entries.length > 1) {
      this.entries.removeAt(index);
    }
  }

  private loadAccounts(): void {
    this.loading.set(true);
    this.accountsService
      .load()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        error: (err: { message: string }) =>
          this.snack.open(`Failed to load accounts: ${err.message}`, 'Close', { duration: 4000 }),
      });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);

    const accountEntries = this.entries.value as { name: string; password: string }[];
    let completed = 0;
    const total = accountEntries.length;

    accountEntries.forEach((entry) => {
      this.accountsService.upsert(entry).subscribe({
        next: () => {
          completed++;
          if (completed === total) {
            this.saving.set(false);
            this.snack.open('Accounts saved successfully!', 'Close', { duration: 3000 });
            this.loadAccounts();
            this.entries.clear();
            this.entries.push(this.buildEntry());
          }
        },
        error: (err: { error?: { message?: string }; message?: string }) => {
          this.saving.set(false);
          this.snack.open(
            `Error saving "${entry.name}": ${err.error?.message ?? err.message}`,
            'Close',
            { duration: 5000 },
          );
        },
      });
    });
  }

  deleteAccount(account: ForumAccountDto): void {
    this.accountsService.remove(account.id).subscribe({
      next: () => {
        this.snack.open(`Deleted "${account.name}"`, 'Close', { duration: 3000 });
        this.loadAccounts();
      },
      error: (err: { error?: { message?: string }; message?: string }) =>
        this.snack.open(
          `Error: ${err.error?.message ?? err.message}`,
          'Close',
          { duration: 5000 },
        ),
    });
  }

  toggleAccount(account: ForumAccountDto): void {
    this.accountsService.toggleActive(account.id).subscribe({
      next: () => this.loadAccounts(),
      error: (err: { error?: { message?: string }; message?: string }) =>
        this.snack.open(
          `Error: ${err.error?.message ?? err.message}`,
          'Close',
          { duration: 5000 },
        ),
    });
  }
}
