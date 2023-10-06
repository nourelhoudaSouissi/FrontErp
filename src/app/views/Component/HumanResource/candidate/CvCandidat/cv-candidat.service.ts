import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import * as countrycitystatejson from 'countrycitystatejson';
import { map, catchError, switchMap } from 'rxjs/operators';
import { EgretCalendarEvent } from 'app/shared/models/event.model';
import { CalendarEventDB } from 'app/shared/inmemory-db/calendarEvents';
import { Employee } from 'app/shared/models/Employee';
import { TechnicalFile } from 'app/shared/models/TechnicalFile';
import { Offer } from 'app/shared/models/Offer';
import { AssOfferCandidate } from 'app/shared/models/AssOfferCandidate';
import { Skills } from 'app/shared/models/Skills';

@Injectable()
export class CvCandidatService {
  private apiUrl = 'http://localhost:8085/rh/employee';
  private apiTechFile = 'http://localhost:8085/rh/technicalFile';
  private apiOffer='http://localhost:8085/rh/Offer'
  private apiEducation = 'http://localhost:8085/rh/education';
  private apiExperience = 'http://localhost:8085/rh/experience';
  private apiLanguage = 'http://localhost:8085/rh/Language';
  private apiSkillCategory = 'http://localhost:8085/rh/skillsCategory';
  private apiSkill = 'http://localhost:8085/rh/skills';
  private apiCertification = 'http://localhost:8085/rh/certification';
  private apiAssOffreCandidat = 'http://localhost:8085/rh/AssOfferCandidate';
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

//******* Implement your APIs ********
getItems(): Observable<Employee[]> {
  const apiUrlWithGET = this.apiUrl + '/getEmployees';
  return this.http.get<any>(apiUrlWithGET).pipe(
    catchError(this.handleError)
  );
}
getOfferItems(): Observable<Offer[]> {
  const apiUrlWithGET = this.apiOffer +'/getAll';
  return this.http.get<any>(apiUrlWithGET).pipe(
    catchError(this.handleError)
  );
}


 // GET an item by id
 getItem(id: number): Observable<Employee> {
  const url = `${this.apiUrl+ '/get'}/${id}`;
  return this.http.get<Employee>(url).pipe(
    catchError(this.handleError)
  );
}


// POST a new item
addItem(candidate: any): Observable<any> {
  const apiUrlWithAdd = this.apiUrl + '/add'; // Append /add to the apiUrl
  return this.http.post<any>(apiUrlWithAdd, candidate).pipe(
    catchError(this.handleError)
  );
}

//POST TF
addTechFile(techfile: any): Observable<any> {
  const apiTechFileWithAdd = this.apiTechFile + '/addTechnicalFile'; // Append /add to the apiUrl
  return this.http.post<any>(apiTechFileWithAdd, techfile).pipe(
    catchError(this.handleError));
}
/////ajout candidature//
addOfferCandidate(offerCandidate : any){
  const url = this.apiAssOffreCandidat + '/add';
  return this.http.post<any>(url,offerCandidate).pipe(
    catchError(this.handleError)
  );
}
//deletecandidature
deleteOfferCandidate(id: number): Observable<AssOfferCandidate> {
 
  const url = `${this.apiAssOffreCandidat+'/delete/'}${id}`;
  return this.http.delete<AssOfferCandidate>(url).pipe(
    catchError(this.handleError)
  );
}
 

//POST education
addEducations(educations: any[]): Observable<any[]> {
  const apiEducationsWithAdd = this.apiEducation + '/addEducations'; // Append /add to the apiUrl
  return this.http.post<any[]>(apiEducationsWithAdd, educations).pipe(
    catchError(this.handleError)
  );
}


//POST experience
addExperience(exp: any): Observable<any> {
  const apiExperienceWithAdd = this.apiExperience + '/add'; // Append /add to the apiUrl
  return this.http.post<any>(apiExperienceWithAdd, exp).pipe(
    catchError(this.handleError)
  );
}

//POST experiences
addExperiences(experiences: any[]): Observable<any[]> {
  const apiExperiencesWithAdd = this.apiExperience + '/addExperiences'; // Append /add to the apiUrl
  return this.http.post<any[]>(apiExperiencesWithAdd, experiences).pipe(
    catchError(this.handleError)
  );
}

//POST Certif
addCertif(certif: any): Observable<any> {
  const  apiCertificationWithAdd = this.apiCertification + '/addCertification'; // Append /add to the apiUrl
  return this.http.post<any>( apiCertificationWithAdd, certif).pipe(
    catchError(this.handleError)
  );
}

//POST Certifications
addCertifs(certifs: any[]): Observable<any[]> {
  const  apiCertificationsWithAdd = this.apiCertification + '/addCertifications'; // Append /add to the apiUrl
  return this.http.post<any>( apiCertificationsWithAdd, certifs).pipe(
    catchError(this.handleError)
  );
}

//POST language
addLanguage(lang: any): Observable<any> {
  const  apiLanguageWithAdd = this.apiLanguage + '/add'; // Append /add to the apiUrl
  return this.http.post<any>(apiLanguageWithAdd, lang).pipe(
    catchError(this.handleError)
  );
}


//POST languages
addLanguages(languages: any[]): Observable<any[]> {
  const apiLanguagesWithAdd = this.apiLanguage + '/addLanguages'; // Append /add to the apiUrl
  return this.http.post<any[]>(apiLanguagesWithAdd, languages).pipe(
    catchError(this.handleError)
  );
}

//POST skill
addSkill(skil: any): Observable<any> {
  const apiSkillWithAdd = this.apiSkill + '/add'; // Append /add to the apiUrl
  return this.http.post<any>(apiSkillWithAdd, skil).pipe(
    catchError(this.handleError)
  );
}

//POST skills
addSkills(skills: any[]): Observable<any[]> {
  const apiSkillsWithAdd = this.apiSkill + '/addAllSkills'; // Append /add to the apiUrl
  return this.http.post<any[]>(apiSkillsWithAdd, skills).pipe(
    catchError(this.handleError)
  );
}



/*getLastEmployeeBack(): Observable<Employee> {
  return this.http.get<Employee>(`${this.apiUrl}/employees/last`);
}*/


// PUT an existing item
updateItem(id: number, candidate: Employee): Observable<Employee> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.put<Employee>(url, candidate).pipe(
    catchError(this.handleError)
  );
}

// DELETE an item by id
deleteItem(id: number): Observable<Employee> {
 
  const url = `${this.apiUrl+'/delete/'}${id}`;
  return this.http.delete<Employee>(url).pipe(
    catchError(this.handleError)
  );
}

/*getLastAddedEmployeeName(): Observable<{ firstName: string, lastName: string }> {
  return this.http.get<Employee[]>(`${this.apiUrl}/employees?_sort=Id&_order=desc&_limit=1`).pipe(
    map(employees => {
      const lastEmployee = employees[0];
      return {
        firstName: lastEmployee.firstName,
        lastName: lastEmployee.lastName
      };
    })
  );
}*/

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




getEmployeesSortedByIdDescending(): Observable<Employee[]> {
  return this.http.get<Employee[]>(`${this.apiUrl}`).pipe(
    map(employees => {
      // Sort employees by Id in descending order
      employees.sort((a, b) => b.id - a.id);
      return employees;
    })
  );
}

getEmployeeById(id: number): Observable<Employee> {
  return this.http.get<Employee>(`${this.apiUrl}/${id}`);
}

getLastEmployee(): Observable<Employee> {
  return this.getEmployeesSortedByIdDescending().pipe(
    map(employees => employees[0]), // Retrieve the first employee
    switchMap(lastEmployee => this.getEmployeeById(lastEmployee.id)) // Retrieve employee details by Id
  );
}

}