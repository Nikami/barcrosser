import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';


export { MatSnackBar } from '@angular/material/snack-bar';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatIconModule,
  MatDividerModule,
  MatMenuModule,
  MatTableModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatProgressBarModule,
];

/**
 * SharedModule re-exports all reusable Angular Material modules.
 * Every feature module should import this instead of importing Material pieces individually.
 */
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
  exports: [CommonModule, ReactiveFormsModule, ...MATERIAL_MODULES],
})
export class SharedModule {}
