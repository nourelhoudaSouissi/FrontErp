import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Weekend } from 'app/shared/models/weekend';
import { WeekendUpdated } from 'app/shared/models/weekendUpdated';

@Injectable({
  providedIn: 'root'
})
export class WeekendService {

  private apiUrl = 'http://localhost:8085/rh/weekend';

  private apiUrlUpdated = 'http://localhost:8085/rh/weekendUpdated';

  constructor(private http: HttpClient) { }

//************************** Weekend **************************************************//
  // Get All Weekends
  getItems(): Observable<Weekend[]> {
    return this.http.get<Weekend[]>(this.apiUrl + '/getAllWeekends').pipe(
      catchError(this.handleError)
    );
  }
  
  
  // Get Weekend by id
  getItem(id: number): Observable<Weekend> {
    const url = `${this.apiUrl+'/getWeekendById'}/${id}`;
    return this.http.get<Weekend>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // DELETE Weekend by id
   deleteItem(id: number): Observable<Weekend> {
    const url = `${this.apiUrl+'/delete'}/${id}`;
    return this.http.delete<Weekend>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // Add new Weekend
  addItem(weekend: any): Observable<any> {
    return this.http.post<Weekend>(`${this.apiUrl+'/createWeekend'}`, weekend).pipe(
      catchError(this.handleError)
    );
  }
  
  
  // PUT an existing Weekend
  updateItem(id: number, weekend: Weekend): Observable<Weekend> {
    const url = `${this.apiUrl +'/updateWeekend'}/${id}`;
    return this.http.put<Weekend>(url, weekend).pipe(
      catchError(this.handleError)
    );
  }

  //************************** Weekend Updated**************************************************//
  // Get All Updated Weekends
  getItemsUpdated(): Observable<WeekendUpdated[]> {
    return this.http.get<WeekendUpdated[]>(this.apiUrlUpdated + '/getAllWeekendUpdated').pipe(
      catchError(this.handleError)
    );
  }
  
  
  // Get Updated Weekend by id
  getItemUpdated(id: number): Observable<WeekendUpdated> {
    const url = `${this.apiUrlUpdated+'/getWeekendUpdatedById'}/${id}`;
    return this.http.get<WeekendUpdated>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // DELETE Updated Weekend by id
   deleteItemUpdated(id: number): Observable<WeekendUpdated> {
    const url = `${this.apiUrlUpdated+'/delete'}/${id}`;
    return this.http.delete<WeekendUpdated>(url).pipe(
      catchError(this.handleError)
    );
  }
  
   // Add new Updated Weekend
  addItemUpdated(weekendUpdated: any): Observable<any> {
    return this.http.post<WeekendUpdated>(`${this.apiUrlUpdated+'/createWeekendUpdated'}`, weekendUpdated).pipe(
      catchError(this.handleError)
    );
  }
  
  
  // PUT an existing Updated Weekend
  updateItemUpdated(id: number, weekendUpdated: WeekendUpdated): Observable<WeekendUpdated> {
    const url = `${this.apiUrlUpdated +'/updateWeekendUpdated'}/${id}`;
    return this.http.put<WeekendUpdated>(url, weekendUpdated).pipe(
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
