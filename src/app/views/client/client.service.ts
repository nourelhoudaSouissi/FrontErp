import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvoiceClient } from 'app/shared/models/invoiceClient.model';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }
  private apiUrl2 = 'http://localhost:8085/fm/billClients';

  getInvoiceClientList(): Observable<InvoiceClient[]> {
    return this.http.get<InvoiceClient[]>(this.apiUrl2).pipe(
      catchError(this.handleError)
    );
  }
  getInvoiceClientById(id: number): Observable<InvoiceClient> {
    const url = `${this.apiUrl2}/${id}`;
    return this.http.get<InvoiceClient>(url).pipe(
      catchError(this.handleError)
    );
  }
  
  saveInvoiceClient(invoice: any): Observable<any> {
    return this.http.post<any>(this.apiUrl2, invoice).pipe(
      catchError(this.handleError)
    );
  }

   // PUT an existing invoice
  updateInvoiceClient(id: number, invoice: InvoiceClient): Observable<InvoiceClient> {
    const url = `${this.apiUrl2}/${id}`;
    return this.http.put<InvoiceClient>(url, invoice).pipe(
      catchError(this.handleError)
    );
  }
  

  deleteInvoiceClient(id: number): Observable<InvoiceClient> {
    const url = `${this.apiUrl2}/${id}`;
    return this.http.delete<InvoiceClient>(url).pipe(
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

function switchMap(arg0: () => any): import("rxjs").OperatorFunction<void, void> {
  throw new Error('Function not implemented.');
}


function of(arg0: null) {
  throw new Error('Function not implemented.');
}

