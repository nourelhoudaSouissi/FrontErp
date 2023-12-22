import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from 'app/shared/models/Profile';
import { Catalog } from 'app/shared/models/Catalog';
import { Observable, catchError, throwError } from 'rxjs';
import { Service } from 'app/shared/models/Service';

@Injectable({
  providedIn: 'root'
})
export class ProfileCatalogService {
  private apiUrl = 'http://localhost:8085/crm/catalogs';
  private apiUrl1 = 'http://localhost:8085/crm/profiles';
  private apiUrl2 = 'http://localhost:8085/referentiel/service';

  constructor(private http: HttpClient) { }

    //******* Implement your APIs ********
    getItems(): Observable<Catalog[]> {
      return this.http.get<Catalog[]>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
    }
  
  
     // GET an item by id
     getItem(id: number): Observable<Catalog> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<Catalog>(url).pipe(
        catchError(this.handleError)
      );
    }
  
    // POST a new item
    addCatalog(catalog: any): Observable<any> {
      console.log(catalog)
      return this.http.post<any>(this.apiUrl, catalog).pipe(
        catchError(this.handleError)
      );
    }
  
    // PUT an existing item
    updateReq(id: number, customer: Catalog): Observable<Catalog> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.put<Catalog>(url, customer).pipe(
        catchError(this.handleError)
      );
    }
  
    // DELETE an item by id
    deleteItem(id: number): Observable<Catalog> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.delete<Catalog>(url).pipe(
        catchError(this.handleError)
      );
    }

    ////////////////////////requested profiles///////////////////////////////////////
    getProfiles(): Observable<Profile[]> {
      return this.http.get<Profile[]>(this.apiUrl1).pipe(
        catchError(this.handleError)
      );
    }

    // GET addresses list by partner id
    getItemProfiles(id: number): Observable<Profile[]> {
      const url = `${this.apiUrl}/${id}/profiles`;
      return this.http.get<Profile[]>(url).pipe(
        catchError(this.handleError)
      )
    }
    // GET addresses list by partner id
    getItemServices(id: number): Observable<Service[]> {
      const url = `${this.apiUrl}/${id}/services`;
      return this.http.get<Service[]>(url).pipe(
        catchError(this.handleError)
      )
    }

    // GET an item by id
    getCatalogByProfileId(profileId: number): Observable<Catalog> {
      const url = `${this.apiUrl}/catalogByProfileId/${profileId}`;
      return this.http.get<Catalog>(url).pipe(
        catchError(this.handleError)
      );
    }
  
     // GET an item by id
     getProfile(id: number): Observable<Profile> {
      const url = `${this.apiUrl1}/${id}`;
      return this.http.get<Profile>(url).pipe(
        catchError(this.handleError)
      );
    }
       // GET an item by id
       getService(id: number): Observable<Service> {
        const url = `${this.apiUrl2}/getServiceById/${id}`;
        return this.http.get<Service>(url).pipe(
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
  
    // PUT an existing item
    updateProfile(id: number, data: any): Observable<Profile> {
      console.log('Updating profile with ID:', id, 'and data:', data);
      const url = `${this.apiUrl1}/${id}`;
      const requestPayload = { ...data, id }
      return this.http.put<Profile>(url, requestPayload).pipe(
        catchError(this.handleError)
      );
    }
  
    // DELETE an item by id
    deleteProfile(id: number): Observable<Profile> {
      const url = `${this.apiUrl1}/${id}`;
      return this.http.delete<Profile>(url).pipe(
        catchError(this.handleError)
      );
    }
      ////////////////////////requested Services///////////////////////////////////////
 // DELETE an item by id
 deleteService(id: number): Observable<Service> {
  const url = `${this.apiUrl2}/${id}`;
  return this.http.delete<Service>(url).pipe(
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
