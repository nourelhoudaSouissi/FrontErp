import { req } from 'app/shared/models/req';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Partner } from 'app/shared/models/Partner';


@Injectable({ providedIn: 'root'})
export class ReqService {
  private apiUrl = 'http://localhost:8085/crm/requirements';
  private apiUrl1 = 'http://localhost:8085/crm/requestedProfiles';
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

    // GET an item by id
    getPartnerByReqId(id: number): Observable<Partner> {
      const url = `${this.apiUrl}/partner/${id}`;
      return this.http.get<Partner>(url).pipe(
        catchError(this.handleError)
      );
    }
  
    // POST a new item
    addReq(customer: any): Observable<any> {
      console.log(customer)
      return this.http.post<any>(this.apiUrl, customer).pipe(
        catchError(this.handleError)
      );
    }
  
    // PUT an existing item
    updateReq(id: number, customer: req): Observable<req> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.put<req>(url, customer).pipe(
        catchError(this.handleError)
      );
    }

    updateReqStatus(id: number, status: string): Observable<any> {
      const url = `${this.apiUrl}/updateReqStatus/${id}`;
      return this.http.put<any>(url, status).pipe(
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
  
    // POST a new item
    addProfile(profile: any): Observable<any> {
      console.log(profile)
      return this.http.post<any>(this.apiUrl1, profile).pipe(
        catchError(this.handleError)
      );
    }

    updateStatusToInProgress(id: number) : Observable<any> {
      const url = `${this.apiUrl}/updateToInProgress/${id}`;
      return this.http.put<any>(url, {}).pipe(
        catchError(this.handleError)
      );
    }

    updateStatusToOpen(id: number) : Observable<any> {
      const url = `${this.apiUrl}/updateToOpen/${id}`;
      return this.http.put<any>(url, {}).pipe(
        catchError(this.handleError)
      );
    }

    updateStatusToClosed(id: number) : Observable<any> {
      const url = `${this.apiUrl}/updateToClosed/${id}`;
      return this.http.put<any>(url, {}).pipe(
        catchError(this.handleError)
      );
    }

    updateStatusToPartiallyWon(id: number) : Observable<any> {
      const url = `${this.apiUrl}/updateToPartiallyWon/${id}`;
      return this.http.put<any>(url, {}).pipe(
        catchError(this.handleError)
      );
    }

    updateStatusToTotallyWon(id: number) : Observable<any> {
      const url = `${this.apiUrl}/updateToTotallyWon/${id}`;
      return this.http.put<any>(url, {}).pipe(
        catchError(this.handleError)
      );
    }

    updateStatusToPartiallyLost(id: number) : Observable<any> {
      const url = `${this.apiUrl}/updateToPartiallyLost/${id}`;
      return this.http.put<any>(url, {}).pipe(
        catchError(this.handleError)
      );
    }

    updateStatusToTotallyLost(id: number) : Observable<any> {
      const url = `${this.apiUrl}/updateToTotallyLost/${id}`;
      return this.http.put<any>(url, {}).pipe(
        catchError(this.handleError)
      );
    }

    updateStatusToAbandoned(id: number) : Observable<any> {
      const url = `${this.apiUrl}/updateToAbandoned/${id}`;
      return this.http.put<any>(url, {}).pipe(
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
