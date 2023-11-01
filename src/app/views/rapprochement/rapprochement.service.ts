import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rapprochement } from 'app/shared/models/rapprochement.model';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RapprochementService {

  private apiUrl = 'http://localhost:8085/fm/bankReconciliation';
  rapprochement: any;
  rapprochementService: any;

  constructor(private http: HttpClient) { }

  getRapprochementList(): Observable<Rapprochement[]> {
    return this.http.get<Rapprochement[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
  getRapprochementById(id: number): Observable<Rapprochement> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Rapprochement>(url).pipe(
      catchError(this.handleError)
    );
  }
  
  saveRapprochement(rapprochement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, rapprochement).pipe(
      catchError(this.handleError)
    );
  }

   // PUT an existing invoice
  updateRapprochement(id: number, rapprochement: Rapprochement): Observable<Rapprochement> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Rapprochement>(url, rapprochement).pipe(
      catchError(this.handleError)
    );
  }
  

  deleteRapprochement(id: number): Observable<Rapprochement> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Rapprochement>(url).pipe(
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

