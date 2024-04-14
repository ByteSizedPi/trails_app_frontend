import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { EventsComponent } from './views/events/events.component';
import { ObserveComponent } from './views/observe/observe.component';
import { SectionsComponent } from './views/sections/sections.component';
import { ManageEventsComponent } from './views/settings/manage-events/manage-events.component';
import { ResultsComponent } from './views/settings/manage-events/results/results.component';
import { NewEventComponent } from './views/settings/new-event/new-event.component';
import { RiderTemplateComponent } from './views/settings/rider-template/rider-template.component';
import { SettingsComponent } from './views/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: EventsComponent },
  { path: 'events/:event_id', component: SectionsComponent },
  { path: 'events/:event_id/section/:section_id', component: ObserveComponent },
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
