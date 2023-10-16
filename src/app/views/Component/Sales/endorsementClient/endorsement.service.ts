import { endorsementClient } from './../../../../shared/models/endorsementClient';
import { catchError } from 'rxjs';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndorsementService {

  private apiUrl = 'http://localhost:8085/crm/endorsementClient';

  constructor(private http: HttpClient) { }
//get all endorsements
  getEndorsements(): Observable<endorsementClient[]> {
    return this.http.get<endorsementClient[]>(this.apiUrl + '/getEndorsements').pipe(
      catchError(this.handleError)
    );
  }


   // GET an item by id
   getItem(id: number): Observable<endorsementClient> {
    const url = `${this.apiUrl}/get/${id}`;
    return this.http.get<endorsementClient>(url).pipe(
      catchError(this.handleError)
    );
  }

  //Add a new endorsement 
  addEndorsement(endorsement: any): Observable<any> {
    console.log(endorsement)
    return this.http.post<any>(this.apiUrl+'/add', endorsement).pipe(
      catchError(this.handleError)
    );
  }

  // PUT an existing item
  updateEndorsement(id: number, endorsement: endorsementClient): Observable<endorsementClient> {
    const url = `${this.apiUrl}/update/${id}`;
    return this.http.put<endorsementClient>(url, endorsement).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE an item by id
  deleteEndorsement(id: number): Observable<endorsementClient> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<endorsementClient>(url).pipe(
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
}
