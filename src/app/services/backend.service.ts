import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { Event, InsertEvent, Rider, Score, Sections } from 'src/models/Types';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private readonly BASE_URL = 'http://localhost:5000/api/';
  private http = inject(HttpClient);

  private httpGet = <T>(url: string) => this.http.get<T>(this.BASE_URL + url);

  verifyAuth = (password: string) => this.httpGet(`validate/${password}`);

  getAllEvents = () => this.httpGet<Event[]>('events/all');

  getEventByID = (event_id: number) =>
    this.httpGet<Event[]>(`events/${event_id}`).pipe(
      map((events) => events[0])
    );

  getAllSections = (event_id: number) =>
    this.httpGet<Sections>(`events/${event_id}/sections/all`);

  getAllRiders = (event_id: number) =>
    this.httpGet<Rider[]>(`events/${event_id}/riders/all`);

  getScores = (
    event_id: number,
    section_number: number,
    rider_number: number
  ) =>
    this.httpGet<Score[]>(
      `events/${event_id}/scores?section_number=${section_number}&rider_number=${rider_number}`
    );

  postScore = (score: {
    event_id: number;
    section_number: number;
    rider_number: number;
    lap_number: number;
    score: number;
  }) => this.http.post(`${this.BASE_URL}score`, score);

  postEvent = (event: InsertEvent, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    Object.keys(event).forEach((key) => {
      formData.append(key, `${event[key as keyof InsertEvent]}`);
    });

    return this.http.post(this.BASE_URL + 'event', formData);
  };
}
