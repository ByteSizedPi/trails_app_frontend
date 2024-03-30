import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, forkJoin, switchMap } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Event } from 'src/models/Types';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrl: './manage-events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageEventsComponent {
  upcomingEvents$ = new Subject<Event[]>();
  completedEvents$ = new Subject<Event[]>();
  pendingRequest$ = new BehaviorSubject<boolean>(false);

  constructor(
    private backend: BackendService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.backend.getUpcomingEvents().subscribe((events) => {
      this.upcomingEvents$.next(events);
    });

    this.backend.getCompletedEvents().subscribe((events) => {
      this.completedEvents$.next(events);
    });
  }

  completeEvent(event_id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to complete this event?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.pendingRequest$.next(true);
        this.backend
          .completeEvent(event_id)
          .pipe(
            switchMap(() =>
              forkJoin([
                this.backend.getCompletedEvents(),
                this.backend.getUpcomingEvents(),
              ])
            )
          )
          .subscribe({
            next: ([completedEvents, upcomingEvents]) => {
              this.completedEvents$.next(completedEvents);
              this.upcomingEvents$.next(upcomingEvents);
              this.pendingRequest$.next(false);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Event completed successfully',
              });
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
              });
              this.pendingRequest$.next(false);
            },
          });
      },
    });
  }

  deleteEvent(event_id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this event?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.pendingRequest$.next(true);
        this.backend
          .deleteEvent(event_id)
          .pipe(
            switchMap(() =>
              forkJoin([
                this.backend.getCompletedEvents(),
                this.backend.getUpcomingEvents(),
              ])
            )
          )
          .subscribe({
            next: ([completedEvents, upcomingEvents]) => {
              this.completedEvents$.next(completedEvents);
              this.upcomingEvents$.next(upcomingEvents);
              this.pendingRequest$.next(false);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Event deleted successfully',
              });
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
              });
              this.pendingRequest$.next(false);
            },
          });
      },
    });
  }
}
