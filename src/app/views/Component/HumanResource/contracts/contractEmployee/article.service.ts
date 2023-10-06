import { articleUpdated } from './../../../../../shared/models/article';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { article } from 'app/shared/models/article';
import { Observable, catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8085/rh/article';
  private apiUrlUpdated ='http://localhost:8085/rh/articleUpdated';

  constructor(private http : HttpClient) { }


  getItems(): Observable<article[]> {
    return this.http.get<article[]>(this.apiUrl + '/getArticles').pipe(
      catchError(this.handleError)
    );
  }
  
  getArticleDescription(articleTitle :string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/description`);
  }

  // PUT an existing item
  updateItem(id: number, article : article): Observable<article> {
    const url = `${this.apiUrl}/update/${id}`;
    return this.http.put<article>(url, article).pipe(
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
