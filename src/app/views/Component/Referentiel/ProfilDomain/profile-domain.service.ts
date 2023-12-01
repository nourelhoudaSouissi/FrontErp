import { Injectable } from '@angular/core';
import { ProfileDomain } from 'app/shared/models/ProfileDomain';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileDomainService {

  private apiUrl = 'http://localhost:8085/referentiel/profileDomain';

 

  constructor(private http: HttpClient) { }

//************************** ProfileDomain **************************************************//
  // Get All ProfileDomains
  getItems(): Observable<ProfileDomain[]> {
    return this.http.get<ProfileDomain[]>(this.apiUrl + '/getAllProfileDomains').pipe(
      catchError(this.handleError)
    );
  }
  
  
  // Get ProfileDomain by id
  getItem(id: number): Observable<ProfileDomain> {
    const url = `${this.apiUrl+'/getProfileDomainById'}/${id}`;
    return this.http.get<ProfileDomain>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // DELETE ProfileDomain by id
   deleteItem(id: number): Observable<ProfileDomain> {
    const url = `${this.apiUrl+'/delete'}/${id}`;
    return this.http.delete<ProfileDomain>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // Add new ProfileDomain
  addItem(profileDomain: any): Observable<any> {
    return this.http.post<ProfileDomain>(`${this.apiUrl+'/createProfileDomain'}`, profileDomain).pipe(
      catchError(this.handleError)
    );
  }
  
  
  // PUT an existing ProfileDomain
  updateItem(id: number, profileDomain: ProfileDomain): Observable<ProfileDomain> {
    const url = `${this.apiUrl +'/updateProfileDomain'}/${id}`;
    return this.http.put<ProfileDomain>(url, profileDomain).pipe(
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
