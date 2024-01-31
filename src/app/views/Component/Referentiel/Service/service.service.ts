import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceReference } from 'app/shared/models/ServiceReference';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:8085/referentiel/serviceReference';

 

  constructor(private http: HttpClient) { }

//************************** PaymentTerm **************************************************//
  // Get All  ServiceReference
  getItems(): Observable<ServiceReference[]> {
    return this.http.get<ServiceReference[]>(this.apiUrl + '/getAllServiceReferences').pipe(
      catchError(this.handleError)
    );
  }
  
  
  // Get ServiceReference  by id
  getItem(id: number): Observable<ServiceReference> {
    const url = `${this.apiUrl+'/getServiceReferenceById'}/${id}`;
    return this.http.get<ServiceReference>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // DELETE ServiceReference by id
   deleteItem(id: number): Observable<ServiceReference> {
    const url = `${this.apiUrl+'/delete'}/${id}`;
    return this.http.delete<ServiceReference>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // Add new ServiceReference
  addItem(serviceReference: any): Observable<any> {
    return this.http.post<ServiceReference>(`${this.apiUrl+'/createServiceReference'}`, serviceReference).pipe(
      catchError(this.handleError)
    );
  }
  
  
  // PUT an existing ServiceReference
  updateItem(id: number, serviceReference: ServiceReference): Observable<ServiceReference> {
    const url = `${this.apiUrl +'/updateServiceReference'}/${id}`;
    return this.http.put<ServiceReference>(url, serviceReference).pipe(
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
