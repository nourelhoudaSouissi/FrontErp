import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from 'app/shared/models/Order';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:8085/crm/orders';

  constructor(private http: HttpClient) { }

    //******* Implement your APIs ********
    getOrders(): Observable<Order[]> {
      return this.http.get<Order[]>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
    }
  
  
     // GET an item by id
     getOrder(id: number): Observable<Order> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<Order>(url).pipe(
        catchError(this.handleError)
      );
    }
  
    // POST a new item
    addOrder(order: any): Observable<any> {
      console.log(order)
      return this.http.post<any>(this.apiUrl, order).pipe(
        catchError(this.handleError)
      );
    }
  
    // PUT an existing item
    updateOrder(id: number, order: Order): Observable<Order> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.put<Order>(url, order).pipe(
        catchError(this.handleError)
      );
    }
  
    // DELETE an item by id
    deleteOrder(id: number): Observable<Order> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.delete<Order>(url).pipe(
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
