import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Employee } from "app/shared/models/Employee";
import { EgretCalendarEvent } from "app/shared/models/event.model";
import { Projet } from "app/shared/models/Projet";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class ProjetService {
  private apiUrl =  'http://localhost:8085/project';
  private apiUrl2 = 'http://localhost:8085/task';
  private apiUrl3 = 'http://localhost:8085/subTask';
  private apiUrl4 = 'http://localhost:8085/phase';
  private apiUrl5 = 'http://localhost:8085/rh/employee';
  
 
  public events: EgretCalendarEvent[];
  constructor(private http: HttpClient) {}
  getItems(): Observable<Projet[]> {
    const apiUrlWithGET = this.apiUrl + '/getAll';
    return this.http.get<any>(apiUrlWithGET).pipe();
  }
  getTask(): Observable<any[]> {
    const apiUrlWithGET = this.apiUrl2 + '/getAll';
    return this.http.get<any>(apiUrlWithGET).pipe();
  }
 /* addTask(task:any): Observable<any> {
    const apiUrlWithGET = this.apiUrl2 + '/add';
    return this.http.post<any>(apiUrlWithGET,task).pipe();
  }*/
  addSubTask(subTask:any): Observable<any> {
    const apiUrlWithGET = this.apiUrl3 + '/add';
    return this.http.post<any>(apiUrlWithGET,subTask).pipe();
  }
  addTask(payload: any) {
    if (payload.status === 'option1') {
      const apiTask = this.apiUrl2 + '/add';
     
      return this.http.post(apiTask , payload);
    } else if (payload.status === 'option2') {
      const apiSubTask = this.apiUrl3 + '/add';
      return this.http.post(apiSubTask , payload);
    }
  }
  addItem(projet: any): Observable<any> {
    const apiUrlWithAdd = this.apiUrl + '/add'; // Append /add to the apiUrl
    return this.http.post<any>(apiUrlWithAdd, projet).pipe();
  }
  addPhase(phases: any[], id: number): Observable<any> {
    const apiUrlWithAdd = `${this.apiUrl4}/addphases`;
    const payload = phases; // Only pass the array of phases as the payload
    
    return this.http.post<any[]>(apiUrlWithAdd, payload, { params: { projectId: id.toString() } }).pipe();
  }
  
  getItem(id: number): Observable<Projet> {
    const url = `${this.apiUrl+ '/getById'}/${id}`;
    return this.http.get<Projet>(url).pipe();
  }
  getTasks(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}/tache`;
    return this.http.get<any>(url).pipe();
  }
  updateItem(id: number, projet: Projet): Observable<Projet> {
    const url = `${this.apiUrl +'/updateById'}/${id}`;
    return this.http.put<Projet>(url, projet).pipe()
      
    
  }
  updateSubTask(id : number , task:any): Observable<any> {
    const url = `${this.apiUrl3+'/update'}/${id}`
    return this.http.put<any>(url, task).pipe()
  }
  updateTask(id: number, projet: any): Observable<any> {
    const url = `${this.apiUrl2 +'/updateById'}/${id}`;
    return this.http.put<any>(url, projet).pipe()
      
    
  }
  deleteItem(id: number): Observable<Projet> {
 
    const url = `${this.apiUrl+'/deleteById'}/${id}`;
    return this.http.delete<Projet>(url).pipe();
  }
  deleteTask(id: number): Observable<any> {
 
    const url = `${this.apiUrl2+'/deleteById'}/${id}`;
    return this.http.delete<any>(url).pipe();
  }
  getResources(id: number): Observable<Employee[]> {
    const url = `${this.apiUrl+ '/getResources'}/${id}`;
    return this.http.get<any>(url).pipe();
  }
  getResp(id: number): Observable<any[]> {
    const url = `${this.apiUrl+ '/getResp'}/${id}`;
    return this.http.get<any>(url).pipe();
  }
  addResourceToProject(projectId: number, employeeIds: number[]) {
    const url = `${this.apiUrl}/${projectId}/resources`;
    return this.http.post(url, employeeIds);
  }
  ProjectTask(projectId: number) {
    const url = `${this.apiUrl}/${projectId}/tasks`;
    return this.http.get(url).pipe();
  }
  ProjectPhase(id: number):Observable<any[]>{
    const url = `${this.apiUrl}/${id}/phases`;
    return this.http.get<any>(url).pipe();
  }

   // Get All Resources (Internal/ External)
   getAllResources(): Observable<Employee[]> {
  return this.http.get<Employee[]>(this.apiUrl5 + '/getAllResources').pipe(
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