import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import * as countrycitystatejson from 'countrycitystatejson';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { EgretCalendarEvent } from 'app/shared/models/event.model';
import { CalendarEventDB } from 'app/shared/inmemory-db/calendarEvents';
import { Employee } from 'app/shared/models/Employee';
import { Offer } from 'app/shared/models/Offer';
import { Skills } from 'app/shared/models/Skills';
import { Language } from 'highlight.js';
import { Certification } from 'app/shared/models/Certification';
import { Experience } from 'app/shared/models/Experience';
import { Education } from 'app/shared/models/Education';
import { TechnicalFile } from 'app/shared/models/TechnicalFile';

@Injectable()
export class updateCandidatService {
  [x: string]: any;
  private apiUrl = 'http://localhost:8085/rh/employee';
  private apiTechFile = 'http://localhost:8085/rh/technicalFile';
  private apiOffer='http://localhost:8085/rh/Offer'
  private apiEducation = 'http://localhost:8085/rh/education';
  private apiExperience = 'http://localhost:8085/rh/experience';
  private apiLanguage = 'http://localhost:8085/rh/Language';
  private apiSkillCategory = 'http://localhost:8085/rh/skillsCategory';
  private apiSkill = 'http://localhost:8085/rh/skills';
  private apiCertification = 'http://localhost:8085/rh/certification';
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







  /////////////////////////update//////////////////////////
/*
  updateEmployee(employeeId: number, updatedEmployee: any): Observable<any> {
    const url = `${this.apiUrl+ '/update'}/${employeeId}`;
    return this.http.put(url, updatedEmployee).pipe(
      tap((res: any) => console.log(`Updated employee with ID ${res.id}`)),
      catchError((err: any) => {
        console.error('Error updating employee', err);
        return throwError(err);
      })
    );
  }*/

 updateEmployee( updatedEmployee: any ,employeeId: number): Observable<any> {
    const url = `${this.apiUrl+ '/update'}/${employeeId}`;
    return this.http.put(url, updatedEmployee).pipe(
      tap((res: any) => console.log(`Updated employee with ID ${res.id}`)),
      catchError((err: any) => {
        console.error('Error updating employee', err);
        return throwError(err);
      })
    );
  }
  
  updateEducation(id: number, education: Education): Observable<Education> {
    const url = `${this.apiEducation+ '/update'}/${id}`;
    return this.http.put<Education>(url, education).pipe(
      catchError(this.handleError)
    );
  }

  updateCertification(id: number, certification: Certification): Observable<Certification> {
    const url = `${this.apiCertification+ '/updateCertification'}/${id}`;
    return this.http.put<Certification>(url, certification).pipe(
      catchError(this.handleError)
    );
  }

//******* Implement your APIs ********
getItems(): Observable<Employee[]> {
  const apiUrlWithGET = this.apiUrl + '/getEmployees';
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
  const url = `${this.apiUrl+ '/update'}/${id}`;
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


addTechFile(techfile: any): Observable<any> {
  const apiTechFileWithAdd = this.apiTechFile + '/addTechnicalFile'; // Append /add to the apiUrl
  return this.http.post<any>(apiTechFileWithAdd, techfile).pipe(
    catchError(this.handleError)
  );
}

updateTechFile(id: number, techFile: TechnicalFile): Observable<TechnicalFile> {
  const url = `${this.apiTechFile+ '/updateTechnicalFile'}/${id}`;
  return this.http.put<TechnicalFile>(url, techFile).pipe(
    catchError(this.handleError)
  );
}
updateExperience(id: number, experience: Experience): Observable<Experience> {
  const url = `${this.apiExperience+ '/update'}/${id}`;
  return this.http.put<Experience>(url, experience).pipe(
    catchError(this.handleError)
  );
}
updateLanguage(id: number, language: Language): Observable<Language> {
  const url = `${this.apiLanguage+ '/update'}/${id}`;
  return this.http.put<Language>(url, language).pipe(
    catchError(this.handleError)
  );
}
updateSkills(id: number, skills: Skills): Observable<Skills> {
  const url = `${this.apiSkill+ '/updateSkills'}/${id}`;
  return this.http.put<Skills>(url, skills).pipe(
    catchError(this.handleError)
  );
}

//POST education
addEducation(education: any): Observable<any> {
  const apiEducationWithAdd = this.apiEducation + '/add'; // Append /add to the apiUrl
  return this.http.post<any>(apiEducationWithAdd, education).pipe(
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

//POST Certif
addCertif(certif: any): Observable<any> {
  const  apiCertificationWithAdd = this.apiCertification + '/addCertification'; // Append /add to the apiUrl
  return this.http.post<any>( apiCertificationWithAdd, certif).pipe(
    catchError(this.handleError)
  );
}

//POST langugae
addLanguage(lang: any): Observable<any> {
  const  apiLanguageWithAdd = this.apiLanguage + '/add'; // Append /add to the apiUrl
  return this.http.post<any>(apiLanguageWithAdd, lang).pipe(
    catchError(this.handleError)
  );
}

//POST skill
addSkill(skil: any): Observable<any> {
  const apiSkillWithAdd = this.apiSkill + '/addSkills'; // Append /add to the apiUrl
  return this.http.post<any>(apiSkillWithAdd, skil).pipe(
    catchError(this.handleError)
  );
}

//POST skill category
addSkillCategory(skillCat: any): Observable<any> {
  const apiSkillCategoryWithAdd = this.apiSkillCategory + '/addSkillsCategory'; // Append /add to the apiUrl
  return this.http.post<any>(apiSkillCategoryWithAdd, skillCat).pipe(
    catchError(this.handleError)
  );
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
getOfferItems(): Observable<Offer[]> {
  const apiUrlWithGET = this.apiOffer +'/getAll';
  return this.http.get<any>(apiUrlWithGET).pipe(
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
// GET an item by id
getItemById(id: number): Observable<Employee> {
  const url = `${this.apiUrl+ '/get'}/${id}`;
  return this.http.get<Employee>(url).pipe(
    catchError(this.handleError)
  );
}
//---Delete-----------
deleteEducation(id: number): Observable<Education> {
 
  const url = `${this.apiEducation+'/delete'}/${id}`;
  return this.http.delete<Education>(url).pipe(
    catchError(this.handleError)
  );
}
deleteExperience(id: number): Observable<Experience> {
 
  const url = `${this.apiExperience+'/delete'}/${id}`;
  return this.http.delete<Experience>(url).pipe(
    catchError(this.handleError)
  );
}
deleteCertificaion(id: number): Observable<Certification> {
 
  const url = `${this.apiCertification+'/deleteCertification'}/${id}`;
  return this.http.delete<Certification>(url).pipe(
    catchError(this.handleError)
  );
}
deleteLanguage(id: number): Observable<Language> {
 
  const url = `${this.apiLanguage+'/delete'}/${id}`;
  return this.http.delete<Language>(url).pipe(
    catchError(this.handleError)
  );
}
deleteSkills(id: number): Observable<Skills> {
 
  const url = `${this.apiSkill+'/delete'}/${id}`;
  return this.http.delete<Skills>(url).pipe(
    catchError(this.handleError)
  );
}



}
