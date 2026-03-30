import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'bc-footer',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
