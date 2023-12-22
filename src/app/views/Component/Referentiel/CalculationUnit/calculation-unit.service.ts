import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalculationUnit } from 'app/shared/models/CalculationUnit';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalculationUnitService {
  private apiUrl = 'http://localhost:8085/referentiel/calculationUnit';

 

  constructor(private http: HttpClient) { }

//************************** PaymentTerm **************************************************//
  // Get All CalculationUnit
  getItems(): Observable<CalculationUnit[]> {
    return this.http.get<CalculationUnit[]>(this.apiUrl + '/getAllTvaCodesCalculationUnits').pipe(
      catchError(this.handleError)
    );
  }
  
  
  // Get CalculationUnit by id
  getItem(id: number): Observable<CalculationUnit> {
    const url = `${this.apiUrl+'/getCalculationUnitById'}/${id}`;
    return this.http.get<CalculationUnit>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // DELETE CalculationUnit by id
   deleteItem(id: number): Observable<CalculationUnit> {
    const url = `${this.apiUrl+'/delete'}/${id}`;
    return this.http.delete<CalculationUnit>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // Add new tvaCode
  addItem(calculationUnit: any): Observable<any> {
    return this.http.post<CalculationUnit>(`${this.apiUrl+'/createCalculationUnit'}`, calculationUnit).pipe(
      catchError(this.handleError)
    );
  }
  
  
  // PUT an tvaCode
  updateItem(id: number, calculationUnit: CalculationUnit): Observable<CalculationUnit> {
    const url = `${this.apiUrl +'/updateCalculationUnit'}/${id}`;
    return this.http.put<CalculationUnit>(url, calculationUnit).pipe(
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
