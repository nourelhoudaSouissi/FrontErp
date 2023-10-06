
import { catchError } from 'rxjs';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { article } from 'app/shared/models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiArticle= 'http://localhost:8085/rh/article';

  constructor(private http: HttpClient) { }
/*************************************** Article API *************************************************************************/
//******* Implement your APIs ********
getArticles(): Observable<article[]> {
  const apiUrl = this.apiArticle + '/getArticles';
  return this.http.get<any>(apiUrl).pipe(
    catchError(this.handleError)
  );
}
 // GET an item by id
 getArticle(id: number): Observable<article> {
  const url = `${this.apiArticle+ '/get'}/${id}`;
  return this.http.get<article>(url).pipe(
    catchError(this.handleError)
  );
}
// POST a new item
addArticle(article: any): Observable<any> {
  const apiUrl = this.apiArticle + '/add'; // Append /add to the apiUrl
  return this.http.post<any>(apiUrl, article).pipe(
    catchError(this.handleError)
  );
}
// PUT an existing item
updateArticle(id: number, article: article): Observable<article> {
  const url = `${this.apiArticle +'/update'}/${id}`;
  return this.http.put<article>(url, article).pipe(
    catchError(this.handleError)
  );
}

// DELETE an item by id
deleteArticle(id: number): Observable<article> {
 
  const url = `${this.apiArticle+'/delete'}/${id}`;
  return this.http.delete<article>(url).pipe(
    catchError(this.handleError)
  );
}
/******************************************   End api Article *****************************************************/


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
