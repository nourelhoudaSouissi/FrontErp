import { availability } from './../../../../shared/models/availability';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from 'app/shared/models/Employee';
import { contract } from 'app/shared/models/contract';
import { Availability } from 'app/shared/models/req';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
 
  private apiUrl = 'http://localhost:8085/rh/employee';
  private apiUrlAv = 'http://localhost:8085/rh/Availability';

  constructor(private http: HttpClient) { 

  }
/******* API InternalResource ********/
 // Get All InetrnalResource
getItems(): Observable<Employee[]> {
  return this.http.get<Employee[]>(this.apiUrl + '/getAllInternes').pipe(
    catchError(this.handleError)
  );
}

getItem(id: number): Observable<Employee> {
  const url = `${this.apiUrl}/get/${id}`;
  return this.http.get<Employee>(url).pipe(
    catchError(this.handleError)
  );
}

 // DELETE  Resource by id
 deleteItem(id: number): Observable<Employee> {
  const url = `${this.apiUrl+'/delete'}/${id}`;
  return this.http.delete<Employee>(url).pipe(
    catchError(this.handleError)
  );
}
/******* API ExternalResource ********/
 // Get All ExternaResource
getItemsExternal(): Observable<Employee[]> {
  return this.http.get<Employee[]>(this.apiUrl + '/getAllExternes').pipe(
    catchError(this.handleError)
  );
}
/****************************  update ********************************************/
// PUT an existing item
updateItem(id: number, employee: Employee): Observable<Employee> {
  const url = `${this.apiUrl+ '/update'}/${id}`;
  return this.http.put<Employee>(url, employee).pipe(
    catchError(this.handleError)
  );
}

getItemContract(id: number): Observable<contract[]> {
  const url = `${this.apiUrl}/${id}/getContractsEmployee`;
  return this.http.get<contract[]>(url).pipe(
    catchError(this.handleError)
  );
}

/**********************************Api Availability ****************************/
addAvailability(availability: any): Observable<any> {
  const url = `${this.apiUrlAv}/add`;
  return this.http.post<any>(url, availability).pipe(
    catchError(this.handleError)
  );
}

getItemsAvailability(): Observable<availability[]> {
  return this.http.get<availability[]>(this.apiUrl + '/getAll').pipe(
    catchError(this.handleError)
  );
}

getItemAvailability(id: number): Observable<availability[]> {
  const url = `${this.apiUrl}/${id}/getAvailabilityEmployee`;
  return this.http.get<availability[]>(url).pipe(
    catchError(this.handleError)
  );
}
// PUT an existing item
updateAvailability(id: number, availability: availability): Observable<availability> {
  const url = `${this.apiUrlAv +'/update'}/${id}`;
  return this.http.put<availability>(url, availability).pipe(
    catchError(this.handleError)
  );
}

 // DELETE  Resource by id
 deleteAvailability(id: number): Observable<availability> {
  const url = `${this.apiUrlAv+'/delete'}/${id}`;
  return this.http.delete<availability>(url).pipe(
    catchError(this.handleError)
  );
}
/**********************************  Error *************************************************************/
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

getSuperior(): Observable<Employee[]> {
  return this.http.get<Employee[]>(this.apiUrl + '/getAllSuperior').pipe(
    catchError(this.handleError)
  );
}


updateSuperiorById(id: number, hierarchicalSuperiorNum : number): Observable<any> {
  const url = `${this.apiUrl}/updateSuperiorById/${id}`;
  return this.http.put<any>(url, hierarchicalSuperiorNum).pipe(
    catchError(this.handleError)
  );
}


}


