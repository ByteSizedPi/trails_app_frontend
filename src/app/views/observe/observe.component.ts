import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ModelSignal,
  effect,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import {
  Observable,
  Subject,
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

  filteredRiders: Rider[] = [];

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

  // dialog related
  visible = signal(false);
  inputValue = model<number>();
  scoreBeingEdited = signal<Score | undefined>(undefined);
  inputValid = new Subject<boolean>();
  editInputEl = viewChild.required<ElementRef<HTMLInputElement>>('editInput');

  constructor() {
    effect(() => {
      if (this.selectedRider()) this.refreshPage();
    });

    effect(() => {
      let value = this.inputValue() ?? 0;
      this.inputValid.next(value >= 0 && value <= 10);
    });
  }

  search(event: AutoCompleteCompleteEvent, riders: Rider[]) {
    this.filteredRiders = riders.filter(
      ({ rider_name, rider_number }) =>
        rider_name
          .toLowerCase()
          .trim()
          .includes(event.query.toLowerCase().trim()) ||
        rider_number.toString().includes(event.query)
    );
  }

  refreshPage() {
    // get previous scores
    this.previousScores$ = this.route.params.pipe(
      // don't refresh if route params don't change
      distinctUntilChanged(),

      // get scores
      switchMap((params) => {
        // set the max number of laps to stop the user from entering more than the max
        this.totalLaps$ = this.backend.getEventByID(params['event_id']).pipe(
          map((event) => event.lap_count),
          shareReplay(1)
        );

        // get scores based on the selected rider
        return this.backend.getScores(
          params['event_id'],
          params['section_id'],
          this.selectedRider()!.rider_number
        );
      }),
      tap(() => this.selectedScore.set(undefined)),
      shareReplay(1)
    );
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

  showEditDialog(score: Score) {
    this.scoreBeingEdited.set(score);
    this.visible.set(true);
    setTimeout(() => this.editInputEl().nativeElement.focus(), 100);
  }

  edit() {
    this.backend
      .editScore({
        event_id: +this.route.snapshot.params['event_id'],
        section_number: +this.route.snapshot.params['section_id'],
        rider_number: this.selectedRider()!.rider_number,
        lap_number: this.scoreBeingEdited()!.lap_number,
        score: this.inputValue()!,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Score updated successfully',
          });
          this.visible.set(false);
          this.refreshPage();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message || 'An error occurred please try again',
          });
        },
      });
  }
}
