import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './views/events/events.component';
import { SettingsComponent } from './views/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: EventsComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
