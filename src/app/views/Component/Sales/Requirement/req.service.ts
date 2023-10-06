import { req } from 'app/shared/models/req';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable()
export class ReqService {
  private apiUrl = 'http://localhost:8085/crm/requirements';
  constructor(private http: HttpClient) { }

    //******* Implement your APIs ********
    getItems(): Observable<req[]> {
      return this.http.get<req[]>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
    }
  
  
     // GET an item by id
     getItem(id: number): Observable<req> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<req>(url).pipe(
        catchError(this.handleError)
      );
    }
  
    // POST a new item
    addItem(customer: any): Observable<any> {
      
      return this.http.post<any>(this.apiUrl, customer).pipe(
        catchError(this.handleError)
      );
    }
  
    // PUT an existing item
    updateItem(id: number, customer: req): Observable<req> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.put<req>(url, customer).pipe(
        catchError(this.handleError)
      );
    }
  
    // DELETE an item by id
    deleteItem(id: number): Observable<req> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.delete<req>(url).pipe(
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
