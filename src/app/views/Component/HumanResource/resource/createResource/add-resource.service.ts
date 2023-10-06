import { Internal } from './../../../../../shared/models/internal';
import { External } from './../../../../../shared/models/externe';
import { BackOffice } from './../../../../../shared/models/backOffice';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Employee } from 'app/shared/models/Employee';
import * as countrycitystatejson from 'countrycitystatejson';

@Injectable({
  providedIn: 'root'
})
export class AddResourceService {

  private apiUrlInternal = 'http://localhost:8085/rh/resource';
  private apiUrlBackOffice = 'http://localhost:8085/rh/backoffice';
  private apiUrlExternal = 'http://localhost:8085/rh/ExternalResource';
  private countryData = countrycitystatejson;
  

  constructor(private http: HttpClient) { 

  }

/******* Implement your APIs   Ressource ********/

/***************************************************  Api Ressource Interne  *************************************************************/
  addInternalItem(Internal: any): Observable<any> {
    const url = `${this.apiUrlInternal}/addResource`;
    return this.http.post<any>(url, Internal).pipe(
      catchError(this.handleError)
    );
  }
  getInternalItems(): Observable<Internal[]> {
    return this.http.get<Internal[]>(this.apiUrlInternal).pipe(
      catchError(this.handleError)
    );
  }
 // GET an item by id
 getInternalItem(id: number): Observable<Internal> {
  const url = `${this.apiUrlInternal}/${id}`;
  return this.http.get<Internal>(url).pipe(
    catchError(this.handleError)
  );
}
  /*
   // PUT an existing item
   updateItem(id: number, resource: Employee): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Employee>(url, resource).pipe(
      catchError(this.handleError)
    );
  }

  deleteItem(id: number): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Employee>(url).pipe(
      catchError(this.handleError)
    );
  }
 */
/************************************************ Api Resource Backoffice    ***************************************************/

addBackOfficeItem(BackOffice: any): Observable<any> {
  const url = `${this.apiUrlBackOffice}/addBackOffice`;
  return this.http.post<any>(url, BackOffice).pipe(
    catchError(this.handleError)
  );
}
getBackOfficeItems(): Observable<BackOffice[]> {
  return this.http.get<BackOffice[]>(this.apiUrlBackOffice).pipe(
    catchError(this.handleError)
  );
}

/**************************************************  Api Resource Externe **********************************************************************/
addExternalItem(External: any): Observable<any>{
  const url = `${this.apiUrlExternal}/add`;
  return this.http.post<any>(url, External).pipe(
    catchError(this.handleError)
  );
  }
  getExternalItems(): Observable<External[]> {
    return this.http.get<External[]>(this.apiUrlExternal).pipe(
      catchError(this.handleError)
    );
  }

/************************************************** Error Handle                     ****************************************************************************/  
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
//-----------------------------------------------------------------
getCountries() {
  return this.countryData.getCountries();
}

getStatesByCountry(name: string) {
  return this.countryData.getStatesByShort(name);
}
}
