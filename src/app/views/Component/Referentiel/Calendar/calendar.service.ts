import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Calendar } from 'app/shared/models/calendar';
import { WeekendUpdated } from 'app/shared/models/weekendUpdated';
import { Holiday } from 'app/shared/models/holiday';
import { CalendarMonth } from 'app/shared/models/calendarMonth';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private apiUrl = 'http://localhost:8085/rh/calendar';

  constructor(private http: HttpClient) { }

  // Get All Calendars
 getItems(): Observable<Calendar[]> {
  return this.http.get<Calendar[]>(this.apiUrl + '/getAllCalendars').pipe(
    catchError(this.handleError)
  );
}


// Get Calendar by id
getItem(id: number): Observable<Calendar> {
  const url = `${this.apiUrl+'/getCalendarById'}/${id}`;
  return this.http.get<Calendar>(url).pipe(
    catchError(this.handleError)
  );
}

 // DELETE Calendar by id
 deleteItem(id: number): Observable<Calendar> {
  const url = `${this.apiUrl+'/delete'}/${id}`;
  return this.http.delete<Calendar>(url).pipe(
    catchError(this.handleError)
  );
}

 // Add new Calendar
addItem(weekend: any): Observable<any> {
  return this.http.post<Calendar>(`${this.apiUrl+'/createCalendar'}`, weekend).pipe(
    catchError(this.handleError)
  );
}


// PUT an existing Calendar
updateItem(id: number, weekend: Calendar): Observable<Calendar> {
  const url = `${this.apiUrl +'/updateCalendar'}/${id}`;
  return this.http.put<Calendar>(url, weekend).pipe(
    catchError(this.handleError)
  );
}

getItemWeekends(id: number): Observable<WeekendUpdated[]> {
  const url = `${this.apiUrl}/${id}/getCalendarWeekends`;
  return this.http.get<WeekendUpdated[]>(url).pipe(
    catchError(this.handleError)
  );
}

getItemHolidays(id: number): Observable<Holiday[]> {
  const url = `${this.apiUrl}/${id}/getCalendarHolidays`;
  return this.http.get<Holiday[]>(url).pipe(
    catchError(this.handleError)
  );
}


getItemCalendarMonths(id: number): Observable<CalendarMonth[]> {
  const url = `${this.apiUrl}/${id}/getCalendarMonths`;
  return this.http.get<CalendarMonth[]>(url).pipe(
    catchError(this.handleError)
  );
}

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
}}
