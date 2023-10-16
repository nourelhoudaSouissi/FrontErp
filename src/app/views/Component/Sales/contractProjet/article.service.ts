import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { article } from 'app/shared/models/article';
import { articleClient } from 'app/shared/models/articleClient';
import { Observable, catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8085/crm/articleClient';

  constructor(private http : HttpClient) { }


  getItems(): Observable<articleClient[]> {
    return this.http.get<articleClient[]>(this.apiUrl + '/getArticles').pipe(
      catchError(this.handleError)
    );
  }
    // GET an item by id
    getItem(id: number): Observable<articleClient> {
      const url = `${this.apiUrl}/get/${id}`;
      return this.http.get<articleClient>(url).pipe(
        catchError(this.handleError)
      );
    }
  //Add a new article 
    addItem(article: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/add', article).pipe(
      catchError(this.handleError)
    );
  }
  

  // PUT an existing item
  updateItem(id: number, article : articleClient): Observable<articleClient> {
    const url = `${this.apiUrl}/update/${id}`;
    return this.http.put<articleClient>(url, article).pipe(
      catchError(this.handleError)
    );
  }
  // DELETE an item by id
  deleteItem(id: number): Observable<articleClient> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<articleClient>(url).pipe(
      catchError(this.handleError)
    );
  }

/*******************************************      handle error       *********************************************************************/
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
