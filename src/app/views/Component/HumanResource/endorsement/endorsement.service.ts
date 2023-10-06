import { Endorsement } from './../../../../shared/models/Endorsement';
import { catchError } from 'rxjs';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndorsementService {

  private apiUrl = 'http://localhost:8085/rh/endorsement';

  constructor(private http: HttpClient) { }
//get all endorsements
  getEndorsements(): Observable<Endorsement[]> {
    return this.http.get<Endorsement[]>(this.apiUrl + '/getEndorsements').pipe(
      catchError(this.handleError)
    );
  }


   // GET an item by id
   getItem(id: number): Observable<Endorsement> {
    const url = `${this.apiUrl}/get/${id}`;
    return this.http.get<Endorsement>(url).pipe(
      catchError(this.handleError)
    );
  }

  //Add a new endorsement 
  addEndorsement(endorsement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/add', endorsement).pipe(
      catchError(this.handleError)
    );
  }

  // PUT an existing item
  updateEndorsement(id: number, endorsement: Endorsement): Observable<Endorsement> {
    const url = `${this.apiUrl}/update/${id}`;
    return this.http.put<Endorsement>(url, endorsement).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE an item by id
  deleteEndorsement(id: number): Observable<Endorsement> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<Endorsement>(url).pipe(
      catchError(this.handleError)
    );
  }

  /********************************************  Api of status endorsement  *****************************************/

  updateToSentById(id: number): Observable<any> {
    const url = `${this.apiUrl}/updateToSentById/${id}`;
    return this.http.put<any>(url, {}).pipe(
      catchError(this.handleError)
    );
  }
  
  updateToAcceptedById(id: number): Observable<any> {
    const url = `${this.apiUrl}/updateToAcceptedById/${id}`;
    return this.http.put<any>(url, {}).pipe(
      catchError(this.handleError)
    );
  }
  
  updateToRefusedById(id: number): Observable<any> {
    const url = `${this.apiUrl}/updateToRefusedById/${id}`;
    return this.http.put<any>(url, {}).pipe(
      catchError(this.handleError)
    );
  }
  
  
  updateToExpiredById(id: number): Observable<any> {
    const url = `${this.apiUrl}/updateToExpiredById/${id}`;
    return this.http.put<any>(url, {}).pipe(
      catchError(this.handleError)
    );
  }
  
  /******************************************** Statistiques endorsement  ***********************************************************/
getAllRefused(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllRefused').pipe(
    catchError(this.handleError)
  );
}
getAllAccepted(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllAccepted').pipe(
    catchError(this.handleError)
  );
}
getAllPending(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllPending').pipe(
    catchError(this.handleError)
  );
}
getAllSent(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllSent').pipe(
    catchError(this.handleError)
  );
}
getAllExpired(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllExpired').pipe(
    catchError(this.handleError)
  );
}



////////////////////////////////////////////////////////
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
