import {
  ChangeDetectionStrategy,
  Component,
  ModelSignal,
  effect,
  inject,
  model,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Observable,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Rider, Score } from 'src/models/Types';

@Component({
  selector: 'app-observe',
  templateUrl: './observe.component.html',
  styleUrl: './observe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObserveComponent {
  private backend = inject(BackendService);
  private route = inject(ActivatedRoute);

  submitPending = signal(false);

  scoreOptions = [0, 1, 2, 3, 5, 10];
  selectedScore: ModelSignal<number | undefined> = model<number>();

  riders$ = this.route.params.pipe(
    map((params) => params['event_id']),
    filter((event_id) => !!event_id),
    distinctUntilChanged(),
    switchMap((section_id) => this.backend.getAllRiders(section_id))
  );
  selectedRider: ModelSignal<Rider | undefined> = model<Rider>();

  previousScores$: Observable<Score[]>;

  constructor() {
    if (localStorage.getItem('selectedRider')) {
      this.selectedRider.set(
        JSON.parse(localStorage.getItem('selectedRider')!)
      );
    }

    effect(() => {
      if (!this.selectedRider()) return;

      // store the selected rider in local storage
      localStorage.setItem(
        'selectedRider',
        JSON.stringify(this.selectedRider())
      );

      this.previousScores$ = this.route.params.pipe(
        distinctUntilChanged(),
        switchMap((params) =>
          this.backend.getScores(
            params['event_id'],
            params['section_id'],
            this.selectedRider()!.rider_number
          )
        ),
        tap(() => this.selectedScore.set(undefined)),
        shareReplay(1)
      );
    });
  }

  submitScore() {
    localStorage.removeItem('selectedRider');
    this.submitPending.set(true);
  }
}
