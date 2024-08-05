import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { BackendService } from '../services/backend.service';

export const eventGuard: CanActivateFn = (route, state) => {
  const backend = inject(BackendService);
  const router = inject(Router);

  console.log(route, state);

  const eventID = route.params['event_id'];

  // make sure we are on the events/:event_id route and that the eventID exists
  if (route.routeConfig?.path !== ':event_id' || !eventID) return true;

  // check if the event has a password
  return backend.eventHasPassword(eventID).pipe(
    switchMap((haspw) => {
      // if it doesn't have a password, we're good to go
      if (!haspw) return of(true);
      // if it requires a password, check if it is in local storage
      const pw = localStorage.getItem(`EventPassword`);
      // if the password doesn't exist, redirect them to the events page
      if (!pw) return router.navigate(['/events']);
      // if the password exists, verify it
      return backend.verifyEventPassword(eventID, pw);
    }),
    switchMap((res) => (res ? of(true) : router.navigate(['/events'])))
  );
};
