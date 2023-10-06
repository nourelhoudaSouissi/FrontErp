import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Holiday } from 'app/shared/models/holiday';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  private apiUrl = 'http://localhost:8085/rh/holiday';

  constructor(private http: HttpClient) { }

  // Get All Holidays
 getItems(): Observable<Holiday[]> {
  return this.http.get<Holiday[]>(this.apiUrl + '/getAllHolidays').pipe(
    catchError(this.handleError)
  );
}


// Get Holiday by id
getItem(id: number): Observable<Holiday> {
  const url = `${this.apiUrl+'/getHolidayById'}/${id}`;
  return this.http.get<Holiday>(url).pipe(
    catchError(this.handleError)
  );
}

 // DELETE Holiday by id
 deleteItem(id: number): Observable<Holiday> {
  const url = `${this.apiUrl+'/delete'}/${id}`;
  return this.http.delete<Holiday>(url).pipe(
    catchError(this.handleError)
  );
}

 // Add new Holiday
addItem(holiday: any): Observable<any> {
  return this.http.post<Holiday>(`${this.apiUrl+'/addHoliday'}`, holiday).pipe(
    catchError(this.handleError)
  );
}


// PUT an existing Holiday
updateItem(id: number, holiday: Holiday): Observable<Holiday> {
  const url = `${this.apiUrl +'/updateHoliday'}/${id}`;
  return this.http.put<Holiday>(url, holiday).pipe(
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
}
}
