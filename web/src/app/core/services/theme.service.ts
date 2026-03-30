import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'default' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly currentTheme = signal<Theme>('default');

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
        document.body.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
        document.body.classList.remove('dark-theme');
      }
    });
  }

  toggleTheme(): void {
    this.currentTheme.update(theme => theme === 'default' ? 'dark' : 'default');
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }
}
