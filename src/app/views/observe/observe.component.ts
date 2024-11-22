import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  model,
  signal,
  viewChild,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { AutoComplete, AutoCompleteCompleteEvent } from "primeng/autocomplete";
import {
  distinctUntilChanged,
  filter,
  map,
  merge,
  of,
  shareReplay,
  Subject,
  switchMap,
} from "rxjs";
import { BackendService } from "src/app/services/backend.service";
import { Rider, Score } from "src/models/Types";

export type ObserveParams = { event_id: string; section_id: string };

@Component({
  selector: "app-observe",
  templateUrl: "./observe.component.html",
  styleUrl: "./observe.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObserveComponent {
  private backend = inject(BackendService);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  private rider = viewChild(AutoComplete);

  filteredRiders: Rider[] = [];
  scoreOptions = [0, 1, 2, 3, 5, 10];

  submitPending = signal(false);
  selectedScore = model<number>();

  private _route = this.route.params.pipe(
    filter((params) => !!params["event_id"]),
    map((params) => params["event_id"]),
    distinctUntilChanged(),
    shareReplay(1)
  );

  riders$ = this._route.pipe(
    switchMap((event_id) => this.backend.getAllRiders(event_id))
  );

  totalLaps$ = this._route.pipe(
    switchMap((event_id) => this.backend.getEventByID(event_id)),
    map(({ lap_count: laps }) => laps),
    shareReplay(1)
  );

  selectedRider = model<Rider | undefined>();
  reloadScores$ = new Subject<Rider>();

  previousScores$ = merge(
    toObservable(this.selectedRider),
    this.reloadScores$
  ).pipe(
    switchMap((rider) => {
      if (rider === undefined || rider === null) return of(undefined);

      setTimeout(() => {
        this.rider()!.inputEL?.nativeElement.blur();
      }, 100);

      const { event_id, section_id } = this.route.snapshot
        .params as ObserveParams;

      return this.backend.getScores(+event_id, +section_id, rider.rider_number);
    }),
    shareReplay(1)
  );

  // dialog related
  visible = signal(false);
  editScore = model<number>();
  scoreBeingEdited = signal<Score | undefined>(undefined);
  editInputEl = viewChild.required<ElementRef<HTMLInputElement>>("editInput");

  inputValid = computed(() => {
    const val = this.editScore();
    return val === undefined ? false : val >= 0 && val <= 10;
  });

  search(event: AutoCompleteCompleteEvent, riders: Rider[]) {
    this.filteredRiders = riders.filter((rider) =>
      this.riderToString(rider)
        .toLowerCase()
        .trim()
        .includes(event.query.toLowerCase().trim())
    );
  }

  submitScore(lap_number: number) {
    this.submitPending.set(true);

    const inputScore = {
      event_id: +this.route.snapshot.params["event_id"],
      section_number: +this.route.snapshot.params["section_id"],
      rider_number: this.selectedRider()!.rider_number,
      lap_number,
      score: this.selectedScore()!,
    };

    this.backend.postScore(inputScore).subscribe({
      next: () => {
        this.selectedScore.set(undefined);
        this.selectedRider.set(undefined);
        this.submitPending.set(false);

        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Score submitted",
        });

        setTimeout(() => this.rider()!.inputEL?.nativeElement.focus(), 100);
      },
      error: (err) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: err.error.message || "An error occurred",
        });
        this.submitPending.set(false);
      },
    });
  }

  showEditDialog(score: Score) {
    this.scoreBeingEdited.set(score);
    this.visible.set(true);
    // setTimeout(() => this.editInputEl().nativeElement.focus(), 100);
  }

  edit() {
    const editScore = {
      event_id: +this.route.snapshot.params["event_id"],
      section_number: +this.route.snapshot.params["section_id"],
      rider_number: this.selectedRider()!.rider_number,
      lap_number: this.scoreBeingEdited()!.lap_number,
      score: this.editScore()!,
    };

    this.backend.editScore(editScore).subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Score updated successfully",
        });
        this.visible.set(false);
        const rider = this.selectedRider();
        if (rider) this.reloadScores$.next(rider);
        console.log("edited");
      },
      error: (err) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: err.error.message || "An error occurred please try again",
        });
      },
    });
  }

  riderToString = ({ rider_number, rider_name, class: cls }: Rider) =>
    `${rider_number} ${rider_name} (${cls})`;
}
