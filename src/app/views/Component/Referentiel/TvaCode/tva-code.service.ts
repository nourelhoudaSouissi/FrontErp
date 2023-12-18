import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TvaCode } from 'app/shared/models/TvaCode';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TvaCodeService {

  private apiUrl = 'http://localhost:8085/referentiel/tvaCode';

 

  constructor(private http: HttpClient) { }

//************************** PaymentTerm **************************************************//
  // Get All tvaCode
  getItems(): Observable<TvaCode[]> {
    return this.http.get<TvaCode[]>(this.apiUrl + '/getAllTvaCodes').pipe(
      catchError(this.handleError)
    );
  }
  
  
  // Get tvaCode by id
  getItem(id: number): Observable<TvaCode> {
    const url = `${this.apiUrl+'/getTvaCodeById'}/${id}`;
    return this.http.get<TvaCode>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // DELETE tvaCode by id
   deleteItem(id: number): Observable<TvaCode> {
    const url = `${this.apiUrl+'/delete'}/${id}`;
    return this.http.delete<TvaCode>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // Add new tvaCode
  addItem(profileDomain: any): Observable<any> {
    return this.http.post<TvaCode>(`${this.apiUrl+'/createTvaCode'}`, profileDomain).pipe(
      catchError(this.handleError)
    );
  }
  
  
  // PUT an tvaCode
  updateItem(id: number, tvaCode: TvaCode): Observable<TvaCode> {
    const url = `${this.apiUrl +'/updateTvaCode'}/${id}`;
    return this.http.put<TvaCode>(url, tvaCode).pipe(
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
