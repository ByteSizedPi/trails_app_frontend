import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { eventGuard } from './guards/event.guard';
import { EventsComponent } from './views/events/events.component';
import { ObserveComponent } from './views/observe/observe.component';
import { SectionsComponent } from './views/sections/sections.component';
import { ManageEventsComponent } from './views/settings/manage-events/manage-events.component';
import { ResultsComponent } from './views/settings/manage-events/results/results.component';
import { NewEventComponent } from './views/settings/new-event/new-event.component';
import { RiderTemplateComponent } from './views/settings/rider-template/rider-template.component';
import { SettingsComponent } from './views/settings/settings.component';

const routes: Routes = [
  {
    path: 'events',
    canActivateChild: [eventGuard],
    children: [
      { path: '', component: EventsComponent },
      { path: ':event_id', component: SectionsComponent },
      {
        path: ':event_id/section/:section_id',
        component: ObserveComponent,
      },
    ],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivateChild: [authGuard],
    children: [
      { path: 'newevent', component: NewEventComponent },
      {
        path: 'manageevents',
        component: ManageEventsComponent,
      },
      { path: 'ridertemplate', component: RiderTemplateComponent },
      { path: 'results/:event_id', component: ResultsComponent },
    ],
  },
  { path: '**', redirectTo: '/events' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
