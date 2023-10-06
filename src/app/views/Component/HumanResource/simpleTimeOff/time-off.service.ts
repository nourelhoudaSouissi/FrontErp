import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { req } from 'app/shared/models/req';
import { TimeOff } from 'app/shared/models/timeOff';

import { Observable, catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TimeOffService {

  private apiUrl = 'http://localhost:8085/rh/TimeOff';

  constructor(private http: HttpClient) { 

  }


  /******* API TimeOff ********/
 // Get All TimeOffs
getItems(): Observable<TimeOff[]> {
  return this.http.get<TimeOff[]>(this.apiUrl + '/getAll').pipe(
    catchError(this.handleError)
  );
}

 // Get Time Off by id
getItem(id: number): Observable<TimeOff> {
  const url = `${this.apiUrl+'/getBy'}/${id}`;
  return this.http.get<TimeOff>(url).pipe(
    catchError(this.handleError)
  );
}

 // DELETE  Time Off by id
 deleteItem(id: number): Observable<TimeOff> {
  const url = `${this.apiUrl+'/delete'}/${id}`;
  return this.http.delete<TimeOff>(url).pipe(
    catchError(this.handleError)
  );
}

 // POST a new item
 addItem(timeOff: any): Observable<any> {
      
  return this.http.post<any>(this.apiUrl +'/add', timeOff).pipe(
    catchError(this.handleError)
  );
}

// PUT an existing item
updateItem(id: number, timeOff: req): Observable<TimeOff> {
  const url = `${this.apiUrl +'/update'}/${id}`;
  return this.http.put<TimeOff>(url, timeOff).pipe(
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
