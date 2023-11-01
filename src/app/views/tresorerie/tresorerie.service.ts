import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Tresorerie } from 'app/shared/models/tresorerie.model';
import { Disbursement } from 'app/shared/models/Disbursement.model';
import { Caisse } from 'app/shared/models/caisse.model';

@Injectable({
  providedIn: 'root'
})
export class TresorerieService {
  private apiUrl = 'http://localhost:8085/fm/collections';
  private apiUrl2 = 'http://localhost:8085/fm/disbursements';
  private apiUrl3 = 'http://localhost:8085/fm/treasuries';



  constructor(private http: HttpClient) { }

  getCollectionList(): Observable<Tresorerie[]> {
    return this.http.get<Tresorerie[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }
  getCollectionById(id: number): Observable<Tresorerie> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Tresorerie>(url).pipe(
      catchError(this.handleError)
    );
  }
  
  saveCollection(tresorerie: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tresorerie).pipe(
      catchError(this.handleError)
    );
  }

   // PUT an existing collection
  updateCollection(id: number, tresorerie: Tresorerie): Observable<Tresorerie> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Tresorerie>(url, tresorerie).pipe(
      catchError(this.handleError)
    );
  }
  

  deleteCollection(id: number): Observable<Tresorerie> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Tresorerie>(url).pipe(
      catchError(this.handleError)
    );
  }



  getDisbursementList(): Observable<Disbursement[]> {
    return this.http.get<Disbursement[]>(this.apiUrl2).pipe(
      catchError(this.handleError)
    );
  }
  getDisbursementById(id: number): Observable<Disbursement> {
    const url = `${this.apiUrl2}/${id}`;
    return this.http.get<Disbursement>(url).pipe(
      catchError(this.handleError)
    );
  }
  
  saveDisbursement(disbursement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl2, disbursement).pipe(
      catchError(this.handleError)
    );
  }

   // PUT an existing collection
  updateDisbursement(id: number, disbursement: Disbursement): Observable<Disbursement> {
    const url = `${this.apiUrl2}/${id}`;
    return this.http.put<Disbursement>(url, disbursement).pipe(
      catchError(this.handleError)
    );
  }
  

  deleteDisbursement(id: number): Observable<Disbursement> {
    const url = `${this.apiUrl2}/${id}`;
    return this.http.delete<Disbursement>(url).pipe(
      catchError(this.handleError)
    );
  }




  
  getCaisseList(): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(this.apiUrl3).pipe(
      catchError(this.handleError)
    );
  }
  getCaisseById(id: number): Observable<Caisse> {
    const url = `${this.apiUrl3}/${id}`;
    return this.http.get<Caisse>(url).pipe(
      catchError(this.handleError)
    );
  }
  
  saveCaisse(disbursement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl3, disbursement).pipe(
      catchError(this.handleError)
    );
  }

   // PUT an existing collection
  updateCaisse(id: number, disbursement: Caisse): Observable<Caisse> {
    const url = `${this.apiUrl3}/${id}`;
    return this.http.put<Caisse>(url, disbursement).pipe(
      catchError(this.handleError)
    );
  }
  

  deleteCaisse(id: number): Observable<Caisse> {
    const url = `${this.apiUrl3}/${id}`;
    return this.http.delete<Caisse>(url).pipe(
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
