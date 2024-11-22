import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, of, tap } from "rxjs";
import {
  Event,
  InsertEvent,
  ResultsSummary,
  Rider,
  Score,
  Sections,
} from "src/models/Types";

@Injectable({
  providedIn: "root",
})
export class BackendService {
  private readonly BASE_URL = "http://localhost:3000/api/";
  // private readonly BASE_URL = 'https://trialsobserver.co.za/api/';
  private http = inject(HttpClient);
  private cacheMap = new Map<string, any>();

  private httpGet = <T>(
    url: string,
    params = {},
    mustCache = true
  ): Observable<T> => {
    let result = this.cacheMap.get(url) as T;
    return mustCache && result !== undefined
      ? of(result)
      : this.http
          .get<T>(this.BASE_URL + url, params)
          .pipe(tap((result) => this.cacheMap.set(url, result)));
  };

  verifyAuth = (password: string) => this.httpGet(`validate/${password}`);

  getAllEvents = () => this.httpGet<Event[]>("events/all", {}, false);

  getUpcomingEvents = () => this.httpGet<Event[]>("events/upcoming", {}, false);

  getCompletedEvents = () =>
    this.httpGet<Event[]>("events/completed", {}, false);

  getTemplate = () => {
    const headers = new HttpHeaders({
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    return this.httpGet<HttpResponse<File>>("template", {
      responseType: "blob",
      observe: "response",
      headers,
    });
  };

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
      `events/${event_id}/scores?section_number=${section_number}&rider_number=${rider_number}`,
      {},
      false
    );

  getResultsSummary = (event_id: string) =>
    this.httpGet<ResultsSummary[]>(`results_summary/${event_id}`);

  getResultsSummaryExcel = (event_id: string) =>
    this.httpGet<HttpResponse<Blob>>(`results_summary/${event_id}/xlsx`, {
      responseType: "blob" as "json",
      observe: "response",
    });

  postScore = (score: {
    event_id: number;
    section_number: number;
    rider_number: number;
    lap_number: number;
    score: number;
  }) => this.http.post(`${this.BASE_URL}score`, score);

  editScore = (score: {
    event_id: number;
    section_number: number;
    rider_number: number;
    lap_number: number;
    score: number;
  }) => this.http.put(`${this.BASE_URL}score`, score);

  completeEvent = (event_id: number) =>
    this.http.put(`${this.BASE_URL}event/${event_id}`, {});

  deleteEvent = (event_id: number) =>
    this.http.delete(`${this.BASE_URL}event/${event_id}`);

  postEvent = (event: InsertEvent, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    let keys = Object.keys(event) as (keyof InsertEvent)[];
    keys.forEach((key) => formData.append(key, `${event[key]}`));

    return this.http.post(this.BASE_URL + "event", formData);
  };

  verifyEventPassword = (event_id: number, password: string) =>
    this.httpGet<boolean>(`event/${event_id}/validate/${password}`).pipe(
      tap(() => localStorage.setItem("EventPassword", password))
    );

  eventHasPassword = (event_id: number) =>
    this.httpGet<boolean>(`event/${event_id}/has_password`);
}
