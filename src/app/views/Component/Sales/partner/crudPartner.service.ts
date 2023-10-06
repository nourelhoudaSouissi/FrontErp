import { Partner } from '../../../../shared/models/Partner';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable,  of,  throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import * as countrycitystatejson from 'countrycitystatejson';
import { req } from 'app/shared/models/req';
import { map } from 'rxjs-compat/operator/map';

@Injectable()
export class CrudPartnerService {
  private apiUrl = 'http://localhost:8085/crm/partners';
  private countryData = countrycitystatejson;
  constructor(private http: HttpClient)
     {  }



  //******* Implement your APIs ********
  getItems(): Observable<Partner[]> {
    return this.http.get<Partner[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }


   // GET an item by id
   getItem(id: number): Observable<Partner> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Partner>(url).pipe(
      catchError(this.handleError)
    );
  }
  /*getrequirement(id: number): Observable<req[]> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Partner>(url).pipe(map(partner => partner.requirements),
    catchError(error => {
      console.error(error);
      return of([]);
    }));
  }*/

  // POST a new item
  addItem(customer: any): Observable<any> {
    
    return this.http.post<any>(this.apiUrl, customer).pipe(
      catchError(this.handleError)
    );
  }

  // PUT an existing item
  updateItem(id: number, customer: Partner): Observable<Partner> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Partner>(url, customer).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE an item by id
  deleteItem(id: number): Observable<Partner> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Partner>(url).pipe(
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
  getCountries() {
    return this.countryData.getCountries();
  }

  getStatesByCountry(name: string) {
    return this.countryData.getStatesByShort(name);
  }



  
}

