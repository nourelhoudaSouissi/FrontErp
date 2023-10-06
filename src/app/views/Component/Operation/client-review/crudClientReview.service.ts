import { throwError } from 'rxjs';
import { clientReviewService } from './../../../../shared/services/auth/webApi/projectApi/clientReview.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDB } from '../../../../shared/inmemory-db/users';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { clientReview } from 'app/shared/models/clientReview.model';

@Injectable()
export class CrudClientReviewService {
  private baseClientReviewUrl = 'http://localhost:8083/api/project/clientReview';

  clientReviewsList: clientReview[];

  clientReview: clientReview;

  errorMessage: string;
  successMessage: string;
  isEditMode: boolean = false;
 
  constructor(private clientReviewService: clientReviewService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient) { }

/*ngOnInit() {
    this.getClientReviewList();
  }*/


  getClientReviewList()  {
    this.clientReviewService.getClientReviewsList()
      .subscribe(
        clientReviewsList => this.clientReviewsList = clientReviewsList,
        error => this.errorMessage = error
      );
  }

  getItems(id: number): Observable<clientReview> {
    const url = `${this.baseClientReviewUrl}/${id}`;
    return this.http.get<clientReview>(url).pipe(
      catchError(this.handleError)
    );
  }


  getClientReviewById(id: number)  {
    this.clientReviewService.getClientReviewById(id)
      .subscribe(
        clientReview => this.clientReview = clientReview,
        error => this.errorMessage = error
      );
  }

  createClientReview(clientReview: clientReview) {
    this.clientReviewService.createClientReview(clientReview)
      .subscribe(
        () => {
          this.successMessage = 'ClientReview created successfully';
          this.getClientReviewList();
        },
        error => this.errorMessage = error
      );
  }

  updateClientReview(id: number,clientReview: clientReview) {
    this.clientReviewService.updateClientReview(id,clientReview)
      .subscribe(
        () => {
          this.successMessage = 'ClientReview updated successfully';
          this.getClientReviewList();
        },
        error => this.errorMessage = error
      );
  }


  deleteItem(id: number): Observable<clientReview> {
    const url = `${this.baseClientReviewUrl}/delete/${id}`;
    return this.http.delete<clientReview>(url).pipe(
      catchError(this.handleError)
    );
  }


  addItem(clientReview: any): Observable<any> {
    return this.http.post<any>(this.baseClientReviewUrl+'/addClientReview', clientReview).pipe(
      catchError(this.handleError)
    );
  }

  updateItem(id: number, clientReview: clientReview): Observable<clientReview> {
    const url = `${this.baseClientReviewUrl}/${id}`;
    return this.http.put<clientReview>(url, clientReview).pipe(
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

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }
  
}
