import { benefit, exceptionalFee } from './../../../../../shared/models/avantagesContrat';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from 'app/shared/models/Employee';
import { Endorsement } from 'app/shared/models/Endorsement';
import { article } from 'app/shared/models/article';
import { contract } from 'app/shared/models/contract';
import { catchError, throwError } from 'rxjs';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ContractEmployeeService {

  private apiUrl = 'http://localhost:8085/rh/contract';
  private apiUrlFee = 'http://localhost:8085/rh/exceptionalFees';
  private apiUrlBenefit ='http://localhost:8085/rh/Benefit' 
  private apiUrlEmployee ='http://localhost:8085/rh/employee' 
  

  constructor(private http: HttpClient) { }

/************************************** Api Contract    *********************************************/
/** getAllContracts**/
  getItems(): Observable<contract[]> {
    return this.http.get<contract[]>(this.apiUrl + '/getAll').pipe(
      catchError(this.handleError)
    );
  }
   /** Add Contract**/
  addItem(contract: any): Observable<any> {
    const url = `${this.apiUrl}/addContract`;
    return this.http.post<any>(url, contract).pipe(
      catchError(this.handleError)
    );
  }


  /** Delete Contract**/
 deleteItem(id: number): Observable<contract> {
  const url = `${this.apiUrl}/deleteContract/${id}`;
  return this.http.delete<contract>(url).pipe(
    catchError(this.handleError)
  );
}

 // GET an item by id
 getItem(id: number): Observable<contract> {
  const url = `${this.apiUrl}/getContract/${id}`;
  return this.http.get<contract>(url).pipe(
    catchError(this.handleError)
  );
}

updateContract(id: number , data:any): Observable<any> {
  const url = `${this.apiUrl}/updateContract/${id}`;
  return this.http.put<any>(url, data).pipe(
    catchError(this.handleError)
  );
}

/** getAllContracts where status est accepted **/
getAllItemsAccepted(): Observable<contract[]> {
  return this.http.get<contract[]>(this.apiUrl + '/getAllAccepted').pipe(
    catchError(this.handleError)
  );
}
/******************************************  Api Exceptional Fee  *************************************************/

/** Add Exceptional Fee **/
addExceptinalFee(exceptionalFee: any): Observable<any> {
  const url = `${this.apiUrlFee}/add`;
  return this.http.post<any>(url, exceptionalFee).pipe(
    catchError(this.handleError)
  );
}

/** Delete Exceptional Fee**/
 
deleteExceptinalFee(id: number): Observable<exceptionalFee> {
  const url = `${this.apiUrlFee}/delete/${id}`;
  return this.http.delete<exceptionalFee>(url).pipe(
    catchError(this.handleError)
  );
}




/*********************************************** Api Benefit    ****************************************************/
/** Add benefit**/
addBenefit(benefit: any): Observable<any> {
  const url = `${this.apiUrlBenefit}/add`;
  return this.http.post<any>(url, benefit).pipe(
    catchError(this.handleError)
  );
}


   
/** Delete Benefit **/
  deleteBenefit(id: number): Observable<benefit> {
    const url = `${this.apiUrlBenefit}/delete/${id}`;
    return this.http.delete<benefit>(url).pipe(
      catchError(this.handleError)
    );
  }






  getItemFee(id: number): Observable<exceptionalFee[]> {
    const url = `${this.apiUrl}/${id}/getContractFee`;
    return this.http.get<exceptionalFee[]>(url).pipe(
      catchError(this.handleError)
    );
  }
   getItemBenefit(id: number): Observable<benefit[]> {
    const url =`${this.apiUrl}/${id}/getContractBenefits`;
    return this.http.get<benefit[]>(url).pipe(
      catchError(this.handleError)
    );
  }
  getItemEnd(id: number): Observable<Endorsement[]> {
    const url =`${this.apiUrl}/${id}/getContractEnd`;
    return this.http.get<Endorsement[]>(url).pipe(
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
  
  
  updateToExpiredById(id: number): Observable<any> {
    const url = `${this.apiUrl}/updateToExpiredById/${id}`;
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



/**************************************** Récupérer tous les ressources ************************************************************************/

getResources(): Observable<Employee[]> {
  return this.http.get<Employee[]>(this.apiUrlEmployee + '/getAllEmployees').pipe(
    catchError(this.handleError)
  );
}




getContractArticle(id: number): Observable<article> {
  const url = `${this.apiUrl}/getArticleContractById/${id}`;
  return this.http.get<article>(url).pipe(
    catchError(this.handleError)
  );
}

/******************************************** Statistiques contrat  ***********************************************************/
getAllRefused(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllRefused').pipe(
    catchError(this.handleError)
  );
}
getAllAccepted(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllAccepted').pipe(
    catchError(this.handleError)
  );
}
getAllPending(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllPending').pipe(
    catchError(this.handleError)
  );
}
getAllSent(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllSent').pipe(
    catchError(this.handleError)
  );
}
getAllExpired(): Observable<any> {
  return this.http.get<any>(this.apiUrl + '/countAllExpired').pipe(
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
