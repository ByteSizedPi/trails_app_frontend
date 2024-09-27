import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  model,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { BackendService } from '../../services/backend.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  private backend = inject(BackendService);
  router = inject(Router);

  visible = model(false);
  inputValue = model('');
  allEvents$ = this.backend.getUpcomingEvents();
  error$ = new Subject<boolean>();
  selectedEvent = model<number | undefined>();

  pwInput = viewChild.required<ElementRef<HTMLInputElement>>('pwInput');

  constructor() {
    effect(() => {
      if (this.inputValue()) this.error$.next(false);
    });
  }

  eventHasPassword(eventID: number) {
    this.backend
      .eventHasPassword(eventID)
      .pipe(
        switchMap((hasPassword) => {
          if (!hasPassword) return this.router.navigate([`/events/${eventID}`]);
          let storedPW = localStorage.getItem('EventPassword');
          if (storedPW)
            return this.backend.verifyEventPassword(eventID, storedPW);
          return [false];
        })
      )
      .subscribe((passDlg) => {
        if (passDlg) return this.router.navigate([`/events/${eventID}`]);

        this.visible.set(true);
        setTimeout(() => this.pwInput().nativeElement.focus(), 200);
        this.selectedEvent.set(eventID);
        return;
      });
  }

  hideDialog() {
    this.visible.set(false);
    this.selectedEvent.set(undefined);
  }

  verifyPassword() {
    this.backend
      .verifyEventPassword(this.selectedEvent()!, this.inputValue())
      .subscribe((isValid) => {
        if (isValid) {
          this.router.navigate([`/events/${this.selectedEvent()}`]);
          this.hideDialog();
        } else {
          setTimeout(() => this.pwInput().nativeElement.focus(), 200);
          this.error$.next(true);
        }
      });
  }
}
