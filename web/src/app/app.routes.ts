import type { Routes } from '@angular/router';

import { HomeComponent } from './features/home';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
];
