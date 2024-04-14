import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { BackendService } from '../../../../services/backend.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  private backend = inject(BackendService);
  private route = inject(ActivatedRoute);

  results$ = this.route.params.pipe(
    map((params) => params['event_id']),
    distinctUntilChanged(),
    switchMap((event_id) => this.backend.getResultsSummary(event_id)),
    tap((e) => console.log(e))
  );
}
