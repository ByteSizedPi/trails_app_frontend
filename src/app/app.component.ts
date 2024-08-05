import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter, map } from 'rxjs';

const urlMap = new Map<string, number>().set('/events', 0).set('/settings', 1);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  router = inject(Router);

  items: MenuItem[] = [
    { label: 'Events', icon: 'pi pi-fw pi-bolt' },
    { label: 'Settings', icon: 'pi pi-fw pi-cog' },
  ];

  activeItem$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(({ url }) => this.items[urlMap.get('/' + url.split('/')[1]) || 0])
  );
}
