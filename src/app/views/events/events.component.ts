import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  allEvents$ = this.backend.getUpcomingEvents();

  constructor(private backend: BackendService, public router: Router) {}
}
