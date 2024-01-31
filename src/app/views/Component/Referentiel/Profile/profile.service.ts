import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileReference } from 'app/shared/models/ProfileReference';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8085/referentiel/profileReference';

 

  constructor(private http: HttpClient) { }

//************************** PaymentTerm **************************************************//
  // Get All  ProfileReference
  getItems(): Observable<ProfileReference[]> {
    return this.http.get<ProfileReference[]>(this.apiUrl + '/getAllProfileReferences').pipe(
      catchError(this.handleError)
    );
  }
  
  
  // Get ProfileReference  by id
  getItem(id: number): Observable<ProfileReference> {
    const url = `${this.apiUrl+'/getProfileReferenceById'}/${id}`;
    return this.http.get<ProfileReference>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // DELETE ProfileReference by id
   deleteItem(id: number): Observable<ProfileReference> {
    const url = `${this.apiUrl+'/delete'}/${id}`;
    return this.http.delete<ProfileReference>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // Add new ProfileReference
  addItem(profileReference: any): Observable<any> {
    return this.http.post<ProfileReference>(`${this.apiUrl+'/createProfileReference'}`, profileReference).pipe(
      catchError(this.handleError)
    );
  }
  
  
  // PUT an existing ProfileReference
  updateItem(id: number, profileReference: ProfileReference): Observable<ProfileReference> {
    const url = `${this.apiUrl +'/updateProfileReference'}/${id}`;
    return this.http.put<ProfileReference>(url, profileReference).pipe(
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
