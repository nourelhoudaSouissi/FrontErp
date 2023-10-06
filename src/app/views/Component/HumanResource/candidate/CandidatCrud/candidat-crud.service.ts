import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import * as countrycitystatejson from 'countrycitystatejson';
import { EgretCalendarEvent } from 'app/shared/models/event.model';
import { CalendarEventDB } from 'app/shared/inmemory-db/calendarEvents';
import { Employee } from 'app/shared/models/Employee';
import { Education } from 'app/shared/models/Education';
import { TechnicalFile } from 'app/shared/models/TechnicalFile';
import { id } from 'date-fns/locale';
import { Experience } from 'app/shared/models/Experience';
import { Certification } from 'app/shared/models/Certification';
import { Language } from 'highlight.js';
import { Skills } from 'app/shared/models/Skills';
import { AssOfferCandidate } from 'app/shared/models/AssOfferCandidate';

@Injectable()

export class CrudService {
  private apiUrl = 'http://localhost:8085/rh/employee';
  private technicalFileApi='http://localhost:8085/rh/technicalFile'
  private apiAssOffreCandidat = 'http://localhost:8085/rh/AssOfferCandidate';

  private countryData = countrycitystatejson;
  public events: EgretCalendarEvent[];

  constructor(private http: HttpClient) {}

  getTechnicalFile(employeeId: number): Observable<TechnicalFile> {
    const technicalApi =  `${this.technicalFileApi}/${employeeId}`+'/employee';
    console.log(this.http.get<any>(technicalApi));
    return this.http.get<any>(technicalApi).pipe(
      catchError(this.handleError)
    );
  }
 
  public getEvents(): Observable<EgretCalendarEvent[]> {
    // return this.http.get('api/calendar/events')
    // .map((events: CalendarEvent[]) => {
    //   this.events = events;
    //   return events;
    // });

    let eventDB = new CalendarEventDB();
    return of(eventDB.events).pipe(
      map((events) => {
        this.events = events;
        return events;
      })
    );
  }
  
  public addEvent(event): Observable<EgretCalendarEvent[]> {
    // return this.http.post('api/calendar/events', event)
    // .map((events: EgretCalendarEvent[]) => {
    //   this.events = events;
    //   return events;
    // });

    this.events.push(event);
    return of(this.events);
  }

  public updateEvent(event): Observable<EgretCalendarEvent[]> {
    // return this.http.put('api/calendar/events/'+event._id, event)
    // .map((events: EgretCalendarEvent[]) => {
    //   this.events = events;
    //   return events;
    // });

    this.events = this.events.map((e) => {
      if (e._id === event._id) {
        return Object.assign(e, event);
      }
      return e;
    });
    return of(this.events);
  }

  public deleteEvent(eventID: string): Observable<EgretCalendarEvent[]> {
    // return this.http.delete('api/calendar/events/'+eventID)
    // .map((events: EgretCalendarEvent[]) => {
    //   this.events = events;
    //   return events;
    // });

    this.events = this.events.filter((e) => e._id !== eventID);
    return of(this.events);
  }







  /////////////////////////Back Connection//////////////////////////
//******* Implement your APIs ********
getItems(): Observable<Employee[]> {
  const apiUrlWithGET = this.apiUrl + '/getEmployees';
  return this.http.get<any>(apiUrlWithGET).pipe(
    catchError(this.handleError)
  );
}


 // GET an item by id
 getItemById(id: number): Observable<Employee> {
  const url = `${this.apiUrl+ '/get'}/${id}`;
  return this.http.get<Employee>(url).pipe(
    catchError(this.handleError)
  );
}
getTechnicalFileById(id: number): Observable<TechnicalFile> {
  const url = `${this.apiUrl+ '/get'}/${id}`+ '/technicalFile';
  return this.http.get<TechnicalFile>(url).pipe(
    catchError(this.handleError)
  );
}
getEducationById(id: number): Observable<Education> {
  const url = `${this.apiUrl+ '/get'}/${id}`+ '/education';
  return this.http.get<Education>(url).pipe(
    catchError(this.handleError)
  );
}
getExperienceById(id: number): Observable<Experience>{
  const url = `${this.apiUrl+ '/get'}/${id}`+ '/experience';
  return this.http.get<Experience>(url).pipe(
    catchError(this.handleError)
  )
}
getCertificationById(id: number): Observable<Certification>{
  const url = `${this.apiUrl+ '/get'}/${id}`+ '/certificaton';
  return this.http.get<Certification>(url).pipe(
    catchError(this.handleError)
  )
}
getLanguageById(id: number): Observable<Language>{
  const url = `${this.apiUrl+ '/get'}/${id}`+ '/language';
  return this.http.get<Language>(url).pipe(
    catchError(this.handleError)
  )
}

getSkillsById(id: number): Observable<Skills>{
  const url = `${this.apiUrl+ '/get'}/${id}`+ '/skills';
  return this.http.get<Skills>(url).pipe(
    catchError(this.handleError)
  )
}
getCandiatureById(id: number): Observable<Employee>{
  const url = `${this.apiUrl+ '/get'}/${id}`+ '/candidature';
  return this.http.get<Employee>(url).pipe(
    catchError(this.handleError)
  )
}
/*getrequirement(id: number): Observable<req[]> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.get<Partner>(url).pipe(map(partner => partner.requirements),
  catchError(error => {
    console.error(error);
    return of([]);
  }));
}*/

// POST a new item
addItem(candidate: any): Observable<any> {
  const apiUrlWithAdd = this.apiUrl + '/add'; // Append /add to the apiUrl
  return this.http.post<any>(apiUrlWithAdd, candidate).pipe(
    catchError(this.handleError)
  );
}
/*
addItem(candidate: any): Observable<any> {
  
  return this.http.post<any>(this.apiUrl, candidate).pipe(
    catchError(this.handleError)
  );
}*/

// PUT an existing item
updateItem(id: number, candidate: Employee): Observable<Employee> {
  console.log(id)
  const url = `${this.apiUrl}/${id}`;
  return this.http.put<Employee>(url, candidate).pipe(
    catchError(this.handleError)
  );
}

// DELETE an item by id
deleteItem(id: number): Observable<Employee> {
 
  const url = `${this.apiUrl+'/delete'}/${id}`;
  return this.http.delete<Employee>(url).pipe(
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
getCountries() {
  return this.countryData.getCountries();
}

getStatesByCountry(name: string) {
  return this.countryData.getStatesByShort(name);
}



///////////Update Status//////
updateToInProcessById(id: number): Observable<any> {
  const url = `${this.apiUrl}/updateToInProcessById/${id}`;
  return this.http.put<any>(url, {}).pipe(
    catchError(this.handleError)
  );
}

updateToInProgressById(id: number): Observable<any> {
  const url = `${this.apiUrl}/updateToInProgressById/${id}`;
  return this.http.put<any>(url, {}).pipe(
    catchError(this.handleError)
  );
}

updateToPreQualifiedById(id: number): Observable<any> {
  const url = `${this.apiUrl}/updateToPreQualifiedById/${id}`;
  return this.http.put<any>(url, {}).pipe(
    catchError(this.handleError)
  );
}

updateToTopProfilesById(id: number): Observable<any> {
  const url = `${this.apiUrl}/updateToTopProfilesById/${id}`;
  return this.http.put<any>(url, {}).pipe(
    catchError(this.handleError)
  );
}

updateToConvertedToResourceById(id: number): Observable<any> {
  const url = `${this.apiUrl}/updateToConvertedToResourceById/${id}`;
  return this.http.put<any>(url, {}).pipe(
    catchError(this.handleError)
  );
}

updateToDoNotContactById(id: number): Observable<any> {
  const url = `${this.apiUrl}/updateToDoNotContactById/${id}`;
  return this.http.put<any>(url, {}).pipe(
    catchError(this.handleError)
  );
}

updateToArchiveById(id: number): Observable<any> {
  const url = `${this.apiUrl}/updateToArchiveById/${id}`;
  return this.http.put<any>(url, {}).pipe(
    catchError(this.handleError)
  );
}

updateToCreateContractById(id: number): Observable<any> {
  const url = `${this.apiUrl}/updateToCreateContractById/${id}`;
  return this.http.put<any>(url, {}).pipe(
    catchError(this.handleError)
  );
}
// les statistiques 
getAllConvertedToRessource(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllConvertedToResource').pipe(
    catchError(this.handleError)
  );
}

getAllArchived(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllArchived').pipe(
    catchError(this.handleError)
  );
}
getAllDoNotContact(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllDoNotContact').pipe(
    catchError(this.handleError)
  );
}

getAllInProcess(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllInProcess').pipe(
    catchError(this.handleError)
  );
}

getAllPreQualified(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllPreQualified').pipe(
    catchError(this.handleError)
  );
}

getAllTopProfiles(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllTopProfiles').pipe(
    catchError(this.handleError)
  );
}
getAllInProgress(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllInProgress').pipe(
    catchError(this.handleError)
  );
}

// Cv print from Mat table

private cvDataSubject = new BehaviorSubject<string>(''); 
getCvData$() {
  return this.cvDataSubject.asObservable();
}

setCvData(cvData: string) { 
  this.cvDataSubject.next(cvData);
}


updateNoteEvaluation(): Observable<number> {
  const url = `${this.apiUrl}/updateNoteEvaluation`;

  return this.http.put<number>(url, {}).pipe(
    catchError(this.handleError)
  );
}


}