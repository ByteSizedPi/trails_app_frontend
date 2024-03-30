import {
  ChangeDetectionStrategy,
  Component,
  ModelSignal,
  model,
  signal,
} from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter, map } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';

const urlMap = new Map<string, number>()
  .set('/newevent', 0)
  .set('/editevents', 1);

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  password: ModelSignal<string | undefined> = model<string>();
  auth = signal(false);
  pwAttempted = signal(false);

  items: MenuItem[] = [
    { label: 'New Event', icon: 'pi pi-fw pi-plus' },
    { label: 'Edit Events', icon: 'pi pi-fw pi-file-edit' },
    { label: 'Rider Template', icon: 'pi pi-fw pi-file' },
  ];

  activeItem$ = this.router.events.pipe(
    filter((event): event is Scroll => event instanceof Scroll),
    map(
      ({ routerEvent: { url } }) =>
        this.items[urlMap.get('/' + url.split('/')[2])!]
    )
  );

  constructor(private backend: BackendService, private router: Router) {
    if (localStorage.getItem('trailsAuth')) this.auth.set(true);
  }

  verify() {
    this.auth.set(false);
    this.backend.verifyAuth(this.password()!).subscribe((res) => {
      if (res) {
        this.auth.set(true);
        localStorage.setItem('trailsAuth', 'true');
      }
      this.pwAttempted.set(true);
    });
  }

  nav(label: string) {
    this.router.navigate([
      `/settings/${label.toLowerCase().replace(/\s/g, '')}`,
    ]);
  }
}
