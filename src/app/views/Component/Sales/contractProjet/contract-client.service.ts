import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from 'app/shared/models/Employee';import { articleClient } from 'app/shared/models/articleClient';
;
import { contractClient } from 'app/shared/models/contractClient';
import { catchError, throwError } from 'rxjs';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ContractClientService {

  private apiUrl = 'http://localhost:8085/crm/contractClient';
  private apiUrlEmployee ='http://localhost:8085/crm/employee' 
  

  constructor(private http: HttpClient) { }

/************************************** Api Contract    *********************************************/
/** getAllContracts**/
  getItems(): Observable<contractClient[]> {
    return this.http.get<contractClient[]>(this.apiUrl + '/getAll').pipe(
      catchError(this.handleError)
    );
  }
   /** Add Contract**/
  addItem(contract: any): Observable<any> {
    const url = `${this.apiUrl}/add`;
    return this.http.post<any>(url, contract).pipe(
      catchError(this.handleError)
    );
  }


  /** Delete Contract**/
 deleteItem(id: number): Observable<contractClient> {
  const url = `${this.apiUrl}/delete/${id}`;
  return this.http.delete<contractClient>(url).pipe(
    catchError(this.handleError)
  );
}

 // GET an item by id
 getItem(id: number): Observable<contractClient> {
  const url = `${this.apiUrl}/get/${id}`;
  return this.http.get<contractClient>(url).pipe(
    catchError(this.handleError)
  );
}



updateItem(id: number, data: any): Observable<any> {
  const url = `${this.apiUrl}/update/${id}`;
  return this.http.put<any>(url, data).pipe(
    catchError(this.handleError)
  );
}







   




/********************************************  Api of status Contract  *****************************************/

  updateToSentById(id: number): Observable<any> {
    const url = `${this.apiUrl}/updateToSentById/${id}`;
    return this.http.put<any>(url, {}).pipe(
      catchError(this.handleError)
    );
  }
  
  updateToAcceptedById(id: number): Observable<any> {
    const url = `${this.apiUrl}/updateToAcceptedById/${id}`;
    return this.http.put<any>(url, {}).pipe(
      catchError(this.handleError)
    );
  }
  
  updateToRefusedById(id: number): Observable<any> {
    const url = `${this.apiUrl}/updateToRefusedById/${id}`;
    return this.http.put<any>(url, {}).pipe(
      catchError(this.handleError)
    );
  }
  

 
/**************************************** Récupérer tous les candidats *****************************************/

getCandidats(): Observable<Employee[]> {
  return this.http.get<Employee[]>(this.apiUrlEmployee + '/getAllNotConverted').pipe(
    catchError(this.handleError)
  );
}

getContractArticle(id: number): Observable<articleClient> {
  const url = `${this.apiUrl}/getArticleContractById/${id}`;
  return this.http.get<articleClient>(url).pipe(
    catchError(this.handleError)
  );
}





/********************************************  Traitement des erreurs *******************************************************************/
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
