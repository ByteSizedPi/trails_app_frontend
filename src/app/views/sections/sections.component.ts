import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { BackendService } from '../../services/backend.service';

type EvWrapper = { event_id: number };

@Component({
  selector: 'app-sections',
  template: `
    <div class="pad">
      <h2>Select a Section to Observe</h2>
      @for (event of (sections$ | async); track event) {
      <p-card
        [header]="'Section ' + event"
        class="p-d-md-none p-flex-row card"
        [ngStyle]="{ margin: '0.5rem' }"
        (click)="router.navigate(['section/' + event], { relativeTo: route })"
      >
      </p-card>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionsComponent {
  private backend = inject(BackendService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  sections$ = this.route.params.pipe(
    filter((eventID): eventID is EvWrapper => !!eventID['event_id']),
    distinctUntilChanged(),
    switchMap(({ event_id: id }) => this.backend.getAllSections(id)),
    map(({ sections: sec }) => sec)
  );
}
