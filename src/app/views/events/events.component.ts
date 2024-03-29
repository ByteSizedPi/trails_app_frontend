import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  constructor(private backend: BackendService) {
    this.backend.getAllEvents().subscribe(console.log);
  }
}
