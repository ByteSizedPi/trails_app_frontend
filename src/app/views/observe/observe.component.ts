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
import { MessageService } from 'primeng/api';
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
  private messageService = inject(MessageService);

  totalLaps$: Observable<number>;
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
    effect(() => {
      if (!this.selectedRider()) return;

      this.previousScores$ = this.route.params.pipe(
        distinctUntilChanged(),
        switchMap((params) => {
          this.totalLaps$ = this.backend.getEventByID(params['event_id']).pipe(
            map((event) => event.lap_count),
            shareReplay(1)
          );

          return this.backend.getScores(
            params['event_id'],
            params['section_id'],
            this.selectedRider()!.rider_number
          );
        }),
        tap(() => this.selectedScore.set(undefined)),
        shareReplay(1)
      );
    });
  }

  submitScore() {
    this.submitPending.set(true);
    this.previousScores$
      .pipe(
        switchMap((scores) => {
          return this.backend.postScore({
            event_id: +this.route.snapshot.params['event_id'],
            section_number: +this.route.snapshot.params['section_id'],
            rider_number: this.selectedRider()!.rider_number,
            lap_number: scores.length + 1,
            score: this.selectedScore()!,
          });
        })
      )
      .subscribe({
        next: () => {
          this.selectedScore.set(undefined);
          this.selectedRider.set(undefined);
          this.submitPending.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Score submitted',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message || 'An error occurred',
          });
          this.submitPending.set(false);
        },
      });
  }
}
