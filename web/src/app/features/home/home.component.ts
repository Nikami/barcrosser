import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { HeaderComponent, FooterComponent } from '@shared/components';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { db } from '../../core/database/app-database';

@Component({
  selector: 'bc-home',
  standalone: true,
  imports: [CommonModule, SharedModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  posts = toSignal(from(liveQuery(() => db.posts.toArray())));

  clearDB() {
    db.posts.clear();
  }
}
