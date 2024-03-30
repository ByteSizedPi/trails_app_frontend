import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  private backend = inject(BackendService);
  router = inject(Router);
  allEvents$ = this.backend.getUpcomingEvents();
}
