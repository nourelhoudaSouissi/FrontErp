import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentTerm } from 'app/shared/models/PaymentTerm';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentTermService {
  private apiUrl = 'http://localhost:8085/referentiel/paymentCondition';

 

  constructor(private http: HttpClient) { }

//************************** PaymentTerm **************************************************//
  // Get All PaymentCondition/ PaymentTerm
  getItems(): Observable<PaymentTerm[]> {
    return this.http.get<PaymentTerm[]>(this.apiUrl + '/getAllPaymentConditions').pipe(
      catchError(this.handleError)
    );
  }
  
  
  // Get PaymentCondition /PaymentTerm by id
  getItem(id: number): Observable<PaymentTerm> {
    const url = `${this.apiUrl+'/getPaymentConditionById'}/${id}`;
    return this.http.get<PaymentTerm>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // DELETE PaymentCondition/PaymentTerm by id
   deleteItem(id: number): Observable<PaymentTerm> {
    const url = `${this.apiUrl+'/delete'}/${id}`;
    return this.http.delete<PaymentTerm>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // Add new PaymentCondition/PaymentTerm
  addItem(profileDomain: any): Observable<any> {
    return this.http.post<PaymentTerm>(`${this.apiUrl+'/createPaymentCondition'}`, profileDomain).pipe(
      catchError(this.handleError)
    );
  }
  
  
  // PUT an existing PaymentCondition
  updateItem(id: number, paymentCondition: PaymentTerm): Observable<PaymentTerm> {
    const url = `${this.apiUrl +'/updatePaymentCondition'}/${id}`;
    return this.http.put<PaymentTerm>(url, paymentCondition).pipe(
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
