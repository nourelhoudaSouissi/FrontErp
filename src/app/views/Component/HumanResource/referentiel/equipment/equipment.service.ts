import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from 'app/shared/models/Employee';
import { Equipment } from 'app/shared/models/equipment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl = 'http://localhost:8085/rh/equipment';

   private apiUrlEmployee = 'http://localhost:8085/rh/employee'

  constructor(private http : HttpClient) { 
  }

    getEquipments(): Observable<Equipment[]> {
      return this.http.get<Equipment[]>(this.apiUrl + '/getAll').pipe(
        catchError(this.handleError)
      );
    }
    
    getEquipment(id: number): Observable<Equipment> {
      const url = `${this.apiUrl}/getById/${id}`;
      return this.http.get<Equipment>(url).pipe(
        catchError(this.handleError)
      );
    }
     // POST a new item
  addEquipment(equipment: any): Observable<any> {
    const url = `${this.apiUrl}/add`;
    return this.http.post<any>(url, equipment).pipe(
      catchError(this.handleError)
    );
  }
  
  // PUT an existing item
  updateEquipment(id: number, equipment: Equipment): Observable<Equipment> {
    const url = `${this.apiUrl}/update/${id}`;
    return this.http.put<Equipment>(url, equipment).pipe(
      catchError(this.handleError)
    );
  }
    
     // DELETE  Resource by id
     deleteEquipment(id: number): Observable<any> {
      const url = `${this.apiUrl}/delete/${id}`;
      return this.http.delete<any>(url).pipe(
        catchError(this.handleError)
      );
    }
   
    /*************************************  Api de modification de status de disponibilité ***********************************/
    updateToAvailableById(id: number): Observable<any> {
      const url = `${this.apiUrl}/updateToAvailableById/${id}`;
      return this.http.put<any>(url, {}).pipe(
        catchError(this.handleError)
      );
    }
    updateToUnavailableById(id: number): Observable<any> {
      const url = `${this.apiUrl}/updateToUnavailableById/${id}`;
      return this.http.put<any>(url, {}).pipe(
        catchError(this.handleError)
      );
    }
    /*************************************  Api d'affectation ***********************************/
    updateAffectedById(id: number): Observable<any> {
      const url = `${this.apiUrl}/updateAffectedById/${id}`;
      return this.http.put<any>(url, {}).pipe(
        catchError(this.handleError)
      );
    }
    updateUnaffectedById(id: number): Observable<any> {
      const url = `${this.apiUrl}/updateUnaffectedById/${id}`;
      return this.http.put<any>(url, {}).pipe(
        catchError(this.handleError)
      );
    }

   
    assignEquipmentToEmployee(employeeId: number, equipmentId: number): Observable<any> {
      const url = `${this.apiUrl}/employees/${employeeId}/equipment/${equipmentId}`;
      return this.http.put(url, null);
    }
  /********************************************   Api update motif en cas d'indisponibilité *************************************************/  


  updateMotifById(id: number, motifUnavailability: string): Observable<any> {
    const url = `${this.apiUrl}/updateMotifById/${id}`;
    return this.http.put<any>(url, { motifUnavailability }).pipe(
      catchError(this.handleError)
    );
  }
  /**************************************** Récupérer tous les ressources ************************************************************************/

getResources(): Observable<Employee[]> {
  return this.http.get<Employee[]>(this.apiUrlEmployee + '/getAllEmployees').pipe(
    catchError(this.handleError)
  );
}


/******************************************** Statistiques équipements ***********************************************************/
getAllAmortizables(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAmortizables').pipe(
    catchError(this.handleError)
  );
}
getAllNonAmortizables(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countNonAmortizables').pipe(
    catchError(this.handleError)
  );
}
getAllAffectables(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAffectables').pipe(
    catchError(this.handleError)
  );
}
getAllNonAffectables(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countNonAffectables').pipe(
    catchError(this.handleError)
  );
}
getAllAvailable(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAvailable').pipe(
    catchError(this.handleError)
  );
}
getAllUnavailable(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countUnavailable').pipe(
    catchError(this.handleError)
  );
}

/***********************************************  les erreurs   *********************************************************/
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
