import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from 'app/shared/models/Employee';
import { TimeOff } from 'app/shared/models/timeOff';
import { Observable, catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TimeOffValidationService {

  private apiUrl = 'http://localhost:8085/rh/TimeOff';
  private apiUrl2 = 'http://localhost:8085/rh/employee';

  constructor(private http: HttpClient) { 

  }


  /******* API TimeOff ********/
 // Get All TimeOffs
getItems(): Observable<TimeOff[]> {
  return this.http.get<TimeOff[]>(this.apiUrl + '/getAll').pipe(
    catchError(this.handleError)
  );
}

 // Get Time Off by id
getItem(id: number): Observable<TimeOff> {
  const url = `${this.apiUrl+'/getBy'}/${id}`;
  return this.http.get<TimeOff>(url).pipe(
    catchError(this.handleError)
  );
}


updateStatusToValidatedById(id: number): Observable<any> {
  const url = `${this.apiUrl}/updateStatusToValidatedById/${id}`;
  return this.http.put<any>(url, {}).pipe(
    catchError(this.handleError)
  );
}
updateStatusToRejectedById(id: number): Observable<any> {
  const url = `${this.apiUrl}/updateStatusToRejectedById/${id}`;
  return this.http.put<any>(url, {}).pipe(
    catchError(this.handleError)
  );
}

// get employee by id
getEmployee(id: number): Observable<Employee> {
  const url = `${this.apiUrl2}/get/${id}`;
  return this.http.get<Employee>(url).pipe(
    catchError(this.handleError)
  );
}


  
 // Get total duration for special paid leave by leave type and employee ID
 getTotalDurationSpecialPaidLeaveByLeaveTypeAndEmployeeId(employeeId: number): Observable<{ name: string, totalDuration: number }[]> {
  const url = `${this.apiUrl}/getTotalDurationSpecialPaidLeaveByLeaveTypeAndEmployeeId/${employeeId}`;
  return this.http.get<{ name: string, totalDuration: number }[]>(url).pipe(
    catchError(this.handleError)
  );
}  
 // Get total duration for sickness leave by leave type and employee ID
 getTotalDurationSicknessLeaveByLeaveTypeAndEmployeeId(employeeId: number): Observable<{ name: string, totalDuration: number }[]> {
  const url = `${this.apiUrl}/getTotalDurationSicknessLeaveByLeaveTypeAndEmployeeId/${employeeId}`;
  return this.http.get<{ name: string, totalDuration: number }[]>(url).pipe(
    catchError(this.handleError)
  );
}  


// Get total duration for sickenss taken by an employee
getTotalDurationSicknessLeaveConsumed(employeeId: number): Observable<number> {
  const url = `${this.apiUrl}/getTotalDurationSicknessLeaveEmployeeId/${employeeId}`;
  return this.http.get<number>(url).pipe(
    catchError(this.handleError)
  );
}



// Get total duration for Special Paid Leave  taken by an employee
getTotalDurationSpecialPaidLeaveConsumed(employeeId: number): Observable<number> {
  const url = `${this.apiUrl}/getTotalDurationSpecialPaidLeaveEmployeeId/${employeeId}`;
  return this.http.get<number>(url).pipe(
    catchError(this.handleError)
  );
}



// Get total duration for Paid Leave  taken by an employee
getTotalDurationPaidLeaveEmployeeId(employeeId: number): Observable<number> {
  const url = `${this.apiUrl}/getTotalDurationPaidLeaveEmployeeId/${employeeId}`;
  return this.http.get<number>(url).pipe(
    catchError(this.handleError)
  );
}


// Get total duration for Unpaid Leave  taken by an employee
getTotalDurationUnpaidLeaveEmployeeId(employeeId: number): Observable<number> {
  const url = `${this.apiUrl}/getTotalDurationUnpaidLeaveEmployeeId/${employeeId}`;
  return this.http.get<number>(url).pipe(
    catchError(this.handleError)
  );
}

// Get leave type durations by employee
getLeaveTypeDurationsByEmployee(employeeId: number): Observable<{ leaveType: string, totalDuration: number }[]> {
  const url = `${this.apiUrl}/getLeaveTypeDurationsByEmployee/${employeeId}`;
  return this.http.get<{ leaveType: string, totalDuration: number }[]>(url).pipe(
    catchError(this.handleError)
  );
}

// Number of leave Pending
getAllPending(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllPending').pipe(
    catchError(this.handleError)
  );
}

// Number of leave Validated
getAllValidated(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllValidated').pipe(
    catchError(this.handleError)
  );
}


// Number of leave Rejected
getAllRejected(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllRejected').pipe(
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
