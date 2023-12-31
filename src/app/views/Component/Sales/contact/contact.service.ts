import { Injectable } from '@angular/core';
import { contact } from 'app/shared/models/contact';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable,  of,  throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { RendezVous } from 'app/shared/models/rendez-vous';
import { ContactNote } from 'app/shared/models/ContactNote';
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl2 = 'http://localhost:8085/crm/contacts';
  private apiUrl1 = 'http://localhost:8085/crm/contactNotes';
  private apiUrl = 'http://localhost:8085/crm/appointments';
  items: any[];
  constructor(private http: HttpClient) { }

  getItems(): Observable<contact[]> {
    return this.http.get<contact[]>(this.apiUrl2).pipe(
      catchError(this.handleError)
    );
  }
  getItem(id: number): Observable<contact> {
    const url = `${this.apiUrl2}/${id}`;
    return this.http.get<contact>(url).pipe(
      catchError(this.handleError)
    );
  }

  // GET appointment list by contact id
  getItemAppointments(id: number): Observable<RendezVous[]> {
    const url = `${this.apiUrl2}/${id}/appointments`;
    return this.http.get<RendezVous[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // GET appointment list by contact id
  getItemNotes(id: number): Observable<ContactNote[]> {
    const url = `${this.apiUrl2}/${id}/contactNotes`;
    return this.http.get<ContactNote[]>(url).pipe(
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
  deleteContact(id: number): Observable<contact> {
    const url = `${this.apiUrl2}/${id}`;
    return this.http.delete<contact>(url).pipe(
      catchError(this.handleError)
    );
  }

  deleteNote(id: number): Observable<ContactNote> {
    const url = `${this.apiUrl1}/${id}`;
    return this.http.delete<ContactNote>(url).pipe(
      catchError(this.handleError)
    );
  }

  deleteAppointment(id: number): Observable<RendezVous> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<RendezVous>(url).pipe(
      catchError(this.handleError)
    );
  }


  addContact(contact: any): Observable<any> {
   
    return this.http.post<any>(this.apiUrl2, contact).pipe(
      catchError(this.handleError)
    );
  }

  addContactNote(contactNote: any): Observable<any>{
    return this.http.post<any>(this.apiUrl1, contactNote).pipe(
      catchError(this.handleError)
    )
  }

  addContactAppointment(appointment: any): Observable<any>{
    return this.http.post<any>(this.apiUrl, appointment).pipe(
      catchError(this.handleError)
    )
  }

  updateContact(id: number, contact: contact): Observable<contact> {
    const url = `${this.apiUrl2}/${id}`;
    return this.http.put<contact>(url,contact).pipe(
      catchError(this.handleError)
    );
  }
  
  updateContactNote(id: number, note: ContactNote): Observable<ContactNote> {
    const url = `${this.apiUrl1}/${id}`;
    return this.http.put<ContactNote>(url, note).pipe(
      catchError(this.handleError)
    );
  }

  updateContactAppointment(id: number, appointment: RendezVous): Observable<RendezVous> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<RendezVous>(url, appointment).pipe(
      catchError(this.handleError)
    );
  }

}
