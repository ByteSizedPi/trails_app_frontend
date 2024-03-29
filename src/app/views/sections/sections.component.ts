import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionsComponent {
  private backend = inject(BackendService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  sections$ = this.route.params.pipe(
    map((params) => params['event_id']),
    filter((event_id) => !!event_id),
    distinctUntilChanged(),
    switchMap((event_id) => this.backend.getAllSections(event_id)),
    map(({ sections }) => sections)
  );
}
