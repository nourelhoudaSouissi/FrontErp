import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import * as countrycitystatejson from 'countrycitystatejson';
import { EgretCalendarEvent } from 'app/shared/models/event.model';
import { CalendarEventDB } from 'app/shared/inmemory-db/calendarEvents';
import { Employee } from 'app/shared/models/Employee';
import { Offer } from 'app/shared/models/Offer';
@Injectable()
export class OfferService {
  private apiUrl = 'http://localhost:8085/rh/Offer';
  private countryData = countrycitystatejson;
  public events: EgretCalendarEvent[];
  constructor(private http: HttpClient) {}

  public getEvents(): Observable<EgretCalendarEvent[]> {
    // return this.http.get('api/calendar/events')
    // .map((events: CalendarEvent[]) => {
    //   this.events = events;
    //   return events;
    // });

    let eventDB = new CalendarEventDB();
    return of(eventDB.events).pipe(
      map((events) => {
        this.events = events;
        return events;
      })
    );
  }
  
  public addEvent(event): Observable<EgretCalendarEvent[]> {
    // return this.http.post('api/calendar/events', event)
    // .map((events: EgretCalendarEvent[]) => {
    //   this.events = events;
    //   return events;
    // });

    this.events.push(event);
    return of(this.events);
  }

  public updateEvent(event): Observable<EgretCalendarEvent[]> {
    // return this.http.put('api/calendar/events/'+event._id, event)
    // .map((events: EgretCalendarEvent[]) => {
    //   this.events = events;
    //   return events;
    // });

    this.events = this.events.map((e) => {
      if (e._id === event._id) {
        return Object.assign(e, event);
      }
      return e;
    });
    return of(this.events);
  }

  public deleteEvent(eventID: string): Observable<EgretCalendarEvent[]> {
    // return this.http.delete('api/calendar/events/'+eventID)
    // .map((events: EgretCalendarEvent[]) => {
    //   this.events = events;
    //   return events;
    // });

    this.events = this.events.filter((e) => e._id !== eventID);
    return of(this.events);
  }







  /////////////////////////Back Connection//////////////////////////
//******* Implement your APIs ********
getItems(): Observable<Offer[]> {
  const apiUrlWithGET = this.apiUrl + '/getAll';
  return this.http.get<any>(apiUrlWithGET).pipe(
    catchError(this.handleError)
  );
}


 // GET an item by id
 getItem(id: number): Observable<Offer> {
  const url = `${this.apiUrl+ '/getBy'}/${id}`;
  return this.http.get<Offer>(url).pipe(
    catchError(this.handleError)
  );
}
/*getrequirement(id: number): Observable<req[]> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.get<Partner>(url).pipe(map(partner => partner.requirements),
  catchError(error => {
    console.error(error);
    return of([]);
  }));
}*/

// POST a new item
addItem(candidate: any): Observable<any> {
  const apiUrlWithAdd = this.apiUrl + '/add'; // Append /add to the apiUrl
  return this.http.post<any>(apiUrlWithAdd, candidate).pipe(
    catchError(this.handleError)
  );
}
/*
addItem(candidate: any): Observable<any> {
  
  return this.http.post<any>(this.apiUrl, candidate).pipe(
    catchError(this.handleError)
  );
}*/

// PUT an existing item
updateItem(id: number, candidate: Offer): Observable<Offer> {
  const url = `${this.apiUrl}/update/${id}`;
  return this.http.put<Offer>(url, candidate).pipe(
    catchError(this.handleError)
  );
}

// DELETE an item by id
deleteItem(id: number): Observable<Offer> {
 
  const url = `${this.apiUrl+'/delete'}/${id}`;
  return this.http.delete<Offer>(url).pipe(
    catchError(this.handleError)
  );
}

////////////////////////////////////////////////////////
private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // Return an observable with a user-facing error message.
  return throwError(
    'Something bad happened; please try again later.');
}
getCountries() {
  return this.countryData.getCountries();
}

getStatesByCountry(name: string) {
  return this.countryData.getStatesByShort(name);
}
}