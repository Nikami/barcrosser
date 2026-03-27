import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TesterComponent } from './features/tester/tester.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, TesterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly title = 'BarCrosser';
}
