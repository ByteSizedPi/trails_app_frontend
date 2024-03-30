import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrl: './manage-events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageEventsComponent {}
