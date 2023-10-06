import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { conact } from 'app/shared/models/conact';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ConanctService {
  private apiUrl = 'http://localhost:8085/crm/contacts';

  constructor(private http: HttpClient)
  {  }



//******* Implement your APIs ********
getItems(): Observable<conact[]> {
 return this.http.get<conact[]>(this.apiUrl).pipe(
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