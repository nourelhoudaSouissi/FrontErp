import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExpenseReport } from 'app/shared/models/expenseReport';
import { req } from 'app/shared/models/req';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseReportService {

  private apiUrl = 'http://localhost:8085/rh/expenseReport';

  constructor(private http: HttpClient) {

   }

   
  /******* API Expense Report ********/
 // Get All Expense Reports
getItems(): Observable<ExpenseReport[]> {
  return this.http.get<ExpenseReport[]>(this.apiUrl + '/getExpenseReports').pipe(
    catchError(this.handleError)
  );
}

 // Get Expense Report by id
getItem(id: number): Observable<ExpenseReport> {
  const url = `${this.apiUrl+'/get'}/${id}`;
  return this.http.get<ExpenseReport>(url).pipe(
    catchError(this.handleError)
  );
}

 // DELETE  Expense Report by id
 deleteItem(id: number): Observable<ExpenseReport> {
  const url = `${this.apiUrl+'/delete'}/${id}`;
  return this.http.delete<ExpenseReport>(url).pipe(
    catchError(this.handleError)
  );
}

 // Add a new Expense Report
 addItem(expenseReport: any): Observable<any> {
      
  return this.http.post<any>(this.apiUrl +'/add', expenseReport).pipe(
    catchError(this.handleError)
  );
}

// UPDATE an existing Expense Report
updateItem(id: number, expenseReport: ExpenseReport): Observable<ExpenseReport> {
  const url = `${this.apiUrl +'/update'}/${id}`;
  return this.http.put<ExpenseReport>(url, expenseReport).pipe(
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
