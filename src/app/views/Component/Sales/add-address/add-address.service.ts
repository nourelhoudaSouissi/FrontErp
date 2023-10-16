import { Injectable } from '@angular/core';
import { contact } from 'app/shared/models/contact';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable,  of,  throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { address } from 'app/shared/models/address';
@Injectable({
  providedIn: 'root'
})
export class AddAddressService {
  private apiUrl = 'http://localhost:8085/crm/addresses';
  
  constructor(private http: HttpClient) { }

  addAddress(address: any): Observable<any> {
    
    return this.http.post<any>(this.apiUrl, address).pipe(
      catchError(this.handleError)
    );
  }
  
  updateAddress(id: number, address: address): Observable<address> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<address>(url, address).pipe();
  }

  // GET an item by id
  getAddress(id: number): Observable<address> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<address>(url).pipe(
      catchError(this.handleError)
    );
  }

  getAddresses(): Observable<address[]> {
    return this.http.get<address[]>(this.apiUrl).pipe(
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