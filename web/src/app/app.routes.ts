import type { Routes } from '@angular/router';

import { TesterComponent } from './features/tester';

export const routes: Routes = [
  { path: '', redirectTo: 'tester', pathMatch: 'full' },
  { path: 'tester', component: TesterComponent },
];
