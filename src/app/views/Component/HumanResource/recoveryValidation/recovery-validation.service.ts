import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { RecoveryLeave } from 'app/shared/models/recoveryLeave';

@Injectable({
  providedIn: 'root'
})
export class RecoveryValidationService {
  private apiUrl = 'http://localhost:8085/rh/recoveryLeave';
  constructor(private http: HttpClient) { }
  
 // Get All recovery 
getItems(): Observable<RecoveryLeave[]> {
  return this.http.get<RecoveryLeave[]>(this.apiUrl + '/getAllRecoveryLeaves').pipe(
    catchError(this.handleError)
  );
}

 // Get Recovery By Id 
getItem(id: number): Observable<RecoveryLeave> {
  const url = `${this.apiUrl+'/getRecoveryLeaveById'}/${id}`;
  return this.http.get<RecoveryLeave>(url).pipe(
    catchError(this.handleError)
  );
}


updateStatusToValidatedById(id: number): Observable<any> {
  const url = `${this.apiUrl}/updateStatusToValidatedById/${id}`;
  return this.http.put<any>(url, {}).pipe(
    catchError(this.handleError)
  );
}
updateStatusToRejectedById(id: number): Observable<any> {
  const url = `${this.apiUrl}/updateStatusToRejectedById/${id}`;
  return this.http.put<any>(url, {}).pipe(
    catchError(this.handleError)
  );
}

/************************************ */
getAllPending(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/getPending').pipe(
    catchError(this.handleError)
  );
}

getAllValidated(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/getValidated').pipe(
    catchError(this.handleError)
  );
}

getAllRejected(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/getRejected').pipe(
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
