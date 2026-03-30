import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { ThemeService, type Theme } from '../../../core/services/theme.service';

@Component({
  selector: 'bc-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly themeService = inject(ThemeService);
  
  readonly currentTheme = this.themeService.currentTheme;

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  logout(): void {
    // Mock implementation for logout
    console.info('Logout clicked (mock implementation)');
  }
}
