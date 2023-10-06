import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import * as countrycitystatejson from 'countrycitystatejson';
import { EgretCalendarEvent } from 'app/shared/models/event.model';
import { CalendarEventDB } from 'app/shared/inmemory-db/calendarEvents';
import { Offer } from 'app/shared/models/Offer';
import { QuestionCategory } from 'app/shared/models/QuestionCategory';
import { Question } from 'app/shared/models/Question';
import { QuestionType } from 'app/shared/models/QuestionType';

@Injectable()


export class referentielService {
  private apiUrl = 'http://localhost:8085/rh/questionCategory';
  private quesTypeUrl = 'http://localhost:8085/rh/QuestionType';
  private questUrl= 'http://localhost:8085/rh/Question'
  private countryData = countrycitystatejson;
  public events: EgretCalendarEvent[];
  constructor(private http: HttpClient) {}

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

  // GET a new item
getItems(): Observable<QuestionCategory[]> {
  const apiUrlWithGET = this.apiUrl + '/getAll';
  return this.http.get<any>(apiUrlWithGET).pipe(
    catchError(this.handleError)
  );
}

getQcategoryByQtype(id: number): Observable<QuestionCategory>{
  const url = `${this.quesTypeUrl+ '/get'}/${id}`+ '/questionCategories';
  return this.http.get<QuestionCategory>(url).pipe(
    catchError(this.handleError)
  )
  }

getAllQuestiontypes(): Observable<QuestionType[]> {
  const quesTypeUrlWithGET = this.quesTypeUrl + '/getAll';
  return this.http.get<any>(quesTypeUrlWithGET).pipe(
    catchError(this.handleError)
  );
}

getQuestionTypeId(id: number): Observable<QuestionType> {
  const url = `${this.quesTypeUrl+ '/getBy'}/${id}`;
  return this.http.get<QuestionType>(url).pipe(
    catchError(this.handleError)
  );
}



getQuestionCategoryId(id: number): Observable<QuestionCategory> {
  const url = `${this.apiUrl+ '/getBy'}/${id}`;
  return this.http.get<QuestionCategory>(url).pipe(
    catchError(this.handleError)
  );
}

getQuestionsById(id: number): Observable<Question>{
  const url = `${this.apiUrl+ '/get'}/${id}`+ '/questions';
  return this.http.get<Question>(url).pipe(
    catchError(this.handleError)
  )
  }

// POST a new item
addItem(candidate: any): Observable<any> {
  const apiUrlWithAdd = this.apiUrl + '/add'; // Append /add to the apiUrl
  return this.http.post<any>(apiUrlWithAdd, candidate).pipe(
    catchError(this.handleError)
  );
}

addQuest(candidate: any): Observable<any> {
  const apiUrlWithAdd = this.questUrl + '/add'; // Append /add to the apiUrl
  return this.http.post<any>(apiUrlWithAdd, candidate).pipe(
    catchError(this.handleError)
  );
}

addQuestionType(questionType: any): Observable<any> {
  const quesTypeUrlWithAdd = this.quesTypeUrl + '/add'; // Append /add to the apiUrl
  return this.http.post<any>(quesTypeUrlWithAdd, questionType).pipe(
    catchError(this.handleError)
  );
}

// PUT an existing item
updateItem(id: number, candidate: Offer): Observable<Offer> {
  const url = `${this.apiUrl +'/update'}/${id}`;
  return this.http.put<Offer>(url, candidate).pipe(
    catchError(this.handleError)
  );
}

/*updateQuestion(Id: number, updatedQuestion: any): Observable<any> {
  const url = `${this.questUrl+ '/update'}/${Id}`;
  return this.http.put(url, updatedQuestion).pipe(
    tap((res: any) => console.log(`Updated question with ID ${res.id}`)),
    catchError((err: any) => {
      console.error('Error updating question', err);
      return throwError(err);
    })
  );
}*/

updateQuestion(Id: number, question: Question): Observable<Question> {
  const url = `${this.questUrl+ '/update'}/${Id}`;
  return this.http.put<Question>(url, question).pipe(
    catchError(this.handleError)
  );
}



// DELETE an item by id
deleteItem(id: number): Observable<Offer> {
  const url = `${this.apiUrl+'/delete'}/${id}`;
  return this.http.delete<Offer>(url).pipe(
    catchError(this.handleError)
  );
 }

 // DELETE an item by id
deleteQuestionType(id: number): Observable<Offer> {
  const url = `${this.quesTypeUrl+'/delete'}/${id}`;
  return this.http.delete<Offer>(url).pipe(
    catchError(this.handleError)
  );
 }

  // DELETE an item by id
  deleteQuestion(id: number): Observable<Question> {
 
    const url = `${this.questUrl+'/delete'}/${id}`;
    return this.http.delete<Question>(url).pipe(
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