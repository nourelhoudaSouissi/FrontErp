import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';import { RecoveryLeave } from 'app/shared/models/recoveryLeave';
@Injectable({
  providedIn: 'root'
})
export class RecoveryLeaveService {
  private apiUrl = 'http://localhost:8085/rh/recoveryLeave';
  constructor(private http: HttpClient) { }

  /******* API TimeOff ********/
 // Get All TimeOffs
getItems(): Observable<RecoveryLeave[]> {
  return this.http.get<RecoveryLeave[]>(this.apiUrl + '/getAllRecoveryLeaves').pipe(
    catchError(this.handleError)
  );
}

 // Get Time Off by id
getItem(id: number): Observable<RecoveryLeave> {
  const url = `${this.apiUrl+'/getRecoveryLeaveById'}/${id}`;
  return this.http.get<RecoveryLeave>(url).pipe(
    catchError(this.handleError)
  );
}

 // DELETE  Time Off by id
 deleteItem(id: number): Observable<RecoveryLeave> {
  const url = `${this.apiUrl+'/delete'}/${id}`;
  return this.http.delete<RecoveryLeave>(url).pipe(
    catchError(this.handleError)
  );
}

 // POST a new item

/*addItem(recoveryLeave: any): Observable<any> {
  const url = `${this.apiUrl+'/addRecoveryLeave'}`;
  return this.http.post<any>(url, recoveryLeave).pipe(
    catchError(this.handleError)
  );
}*/
addItem(recoveryLeave: any): Observable<any> {
      
  return this.http.post<RecoveryLeave>(`${this.apiUrl+'/addRecoveryLeave'}`, recoveryLeave).pipe(
    catchError(this.handleError)
  );
}


// PUT an existing item
updateItem(id: number, recoveryLeave: RecoveryLeave): Observable<RecoveryLeave> {
  const url = `${this.apiUrl +'/updateRecoveryLeave'}/${id}`;
  return this.http.put<RecoveryLeave>(url, recoveryLeave).pipe(
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
