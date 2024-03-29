import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private readonly BASE_URL = 'http://localhost:5000/api/';
  private http = inject(HttpClient);

  private httpGet = (url: string) => this.http.get(this.BASE_URL + url);

  getAllEvents() {
    return this.httpGet('events/all');
  }
}
