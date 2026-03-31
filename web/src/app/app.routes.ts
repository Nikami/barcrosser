import type { Routes } from '@angular/router';

import { HomeComponent } from './features/home';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings').then((m) => m.SettingsComponent),
  },
  {
    path: 'banking',
    loadComponent: () =>
      import('./features/banking').then((m) => m.BankingComponent),
  },
];

