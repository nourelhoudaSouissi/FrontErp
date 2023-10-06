import { Injectable } from '@angular/core';
import { ahmed } from 'app/shared/models/ahmed';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Injectable()
export class ahmedService {
  private apiUrl2 = 'http://localhost:8085/crm/contacts';
  constructor(private http: HttpClient) { }

  getItems(): Observable<ahmed[]> {
    return this.http.get<ahmed[]>(this.apiUrl2).pipe(
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
  deleteItem(id: number): Observable<ahmed> {
    const url = `${this.apiUrl2}/${id}`;
    return this.http.delete<ahmed>(url).pipe(
      catchError(this.handleError)
    );
  }
}
