import { Partner } from '../../../../shared/models/Partner';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable,  of,  throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import * as countrycitystatejson from 'countrycitystatejson';
import { req } from 'app/shared/models/req';
import { contact } from 'app/shared/models/contact';
import { socialMedia } from 'app/shared/models/socialMedia';
import { address } from 'app/shared/models/address';
import { offeredService } from 'app/shared/models/offeredService';
import { BankAccount } from 'app/shared/models/BankAccount';

@Injectable()
export class CrudPartnerService {
  private apiUrl = 'http://localhost:8085/crm/partners';
  private apiUrl1 = 'http://localhost:8085/crm/socialMedias';
  private apiUrl2 = 'http://localhost:8085/crm/addresses';
  private apiUrl3 = 'http://localhost:8085/crm/contacts';
  private apiUrl4 = 'http://localhost:8085/crm/requirements';
  private apiUrl5 = 'http://localhost:8085/crm/offeredServices';
  private apiUrl6 = 'http://localhost:8085/crm/bankAccounts';
  private countryData = countrycitystatejson;
  constructor(private http: HttpClient)
     {  }



  //******* Implement your APIs ********
  //get all the partners
  getItems(): Observable<Partner[]> {
    return this.http.get<Partner[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }


   // GET a partner by id
   getItem(id: number): Observable<Partner> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Partner>(url).pipe(
      catchError(this.handleError)
    );
  }

  // GET requirements list by partner id
  getItemReq(id: number): Observable<req[]> {
    const url = `${this.apiUrl}/${id}/requirements`;
    return this.http.get<req[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // GET contacts list by partner id
  getItemContact(id: number): Observable<contact[]> {
    const url = `${this.apiUrl}/${id}/contacts`;
    return this.http.get<contact[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // GET social medias list by partner id
  getItemSocialMedias(id: number): Observable<socialMedia[]> {
    const url = `${this.apiUrl}/${id}/socialMedias`;
    return this.http.get<socialMedia[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // GET offered services list by partner id
  getItemOffered(id: number): Observable<offeredService[]> {
    const url = `${this.apiUrl}/${id}/offered`;
    return this.http.get<offeredService[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // GET addresses list by partner id
   getItemAddresses(id: number): Observable<address[]> {
    const url = `${this.apiUrl}/${id}/addresses`;
    return this.http.get<address[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // GET addresses list by partner id
  getItemAccounts(id: number): Observable<BankAccount[]> {
    const url = `${this.apiUrl}/${id}/bankAccounts`;
    return this.http.get<BankAccount[]>(url).pipe(
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

  //add a new partner
  addItem(customer: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, customer).pipe(
      catchError(this.handleError)
    );
  }

  //ajouter les coordonnées du partnaire (step 2)
  addPartnerCoordonnees(partner: any): Observable<any>{
    const url = `${this.apiUrl}/coordonnees`;
    return this.http.post<any>(url, partner).pipe(
      catchError(this.handleError)
    )
  }

  // Ajouter un compte bancaire au partenaire(step 3)
  addBankAccount(bankAccount: any): Observable<any> {
    const url = `${this.apiUrl6}`
    return this.http.post<any>(url, bankAccount).pipe(
      catchError(this.handleError)
    );
  }

  //ajouter les infos financières du partnaire (step 3)
  addPartnerFinancial(partner: any): Observable<any>{
    const url = `${this.apiUrl}/financial`;
    return this.http.post<any>(url, partner).pipe(
      catchError(this.handleError)
    )
  }

  //ajouter les infos complémentaires du partnaire (step 5)
  finishPartnerInfos(partner: any): Observable<any>{
    const url = `${this.apiUrl}/final`;
    return this.http.post<any>(url, partner).pipe(
      catchError(this.handleError)
    )
  }

  //add a new partner contact
  addContact(contact: any): Observable<any>{
    return this.http.post<any>(this.apiUrl3, contact).pipe(
      catchError(this.handleError)
    )
  }

  //add a new partner social media
  addPartnerSocialMedia(socialMedia: any): Observable<any>{
    return this.http.post<any>(this.apiUrl1, socialMedia).pipe(
      catchError(this.handleError)
    )
  }

  //add a new partner offered service
  addOffered(offered: any): Observable<any>{
    return this.http.post<any>(this.apiUrl5, offered).pipe(
      catchError(this.handleError)
    )
  }

  //add a new partner bank account
  addAccount(account: any): Observable<any>{
    return this.http.post<any>(this.apiUrl6, account).pipe(
      catchError(this.handleError)
    )
  }

  //update an existing partner
  updateItem(id: number, customer: Partner): Observable<Partner> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Partner>(url, customer).pipe(
      catchError(this.handleError)
    );
  }

  //update partner contact
  updateContact(id: number, contact: contact): Observable<contact> {
    const url = `${this.apiUrl3}/${id}`;
    return this.http.put<contact>(url, contact).pipe(
      catchError(this.handleError)
    );
  }

  //update partner social media
  updateSocialMedia(id: number, socialMedia: socialMedia): Observable<socialMedia> {
    const url = `${this.apiUrl1}/${id}`;
    return this.http.put<socialMedia>(url, socialMedia).pipe(
      catchError(this.handleError)
    );
  }

  //update partner offered service
  updateOffered(id: number, offered: offeredService): Observable<offeredService> {
    const url = `${this.apiUrl5}/${id}`;
    return this.http.put<offeredService>(url, offered).pipe(
      catchError(this.handleError)
    );
  }

  //update partner bank account
  updateAccount(id: number, account: BankAccount): Observable<BankAccount> {
    const url = `${this.apiUrl6}/${id}`;
    return this.http.put<BankAccount>(url, account).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE a partner by id
  deleteItem(id: number): Observable<Partner> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Partner>(url).pipe(
      catchError(this.handleError)
    );
  }

  //delete a partner address
  deleteAddress(id: number): Observable<address> {
    const url = `${this.apiUrl2}/${id}`;
    return this.http.delete<address>(url).pipe(
      catchError(this.handleError)
    );
  }

  //delete a partner contact
  deleteContact(id: number): Observable<contact> {
    const url = `${this.apiUrl3}/${id}`;
    return this.http.delete<contact>(url).pipe(
      catchError(this.handleError)
    );
  }

  //delete a partner requirement
  deleteBesoin(id: number): Observable<req> {
    const url = `${this.apiUrl4}/${id}`;
    return this.http.delete<req>(url).pipe(
      catchError(this.handleError)
    );
  }

  deleteSocialMedia(id: number): Observable<socialMedia>{
    const url = `${this.apiUrl1}/${id}`;
    return this.http.delete<socialMedia>(url).pipe(
      catchError(this.handleError)
    );
  }

  deleteOffered(id: number): Observable<offeredService>{
    const url = `${this.apiUrl5}/${id}`;
    return this.http.delete<offeredService>(url).pipe(
      catchError(this.handleError)
    );
  }

  deleteAccount(id: number): Observable<BankAccount>{
    const url = `${this.apiUrl6}/${id}`;
    return this.http.delete<BankAccount>(url).pipe(
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

  // get countries list
  getCountries() {
    return this.countryData.getCountries();
  }

  // get cities of a given country
  getStatesByCountry(name: string) {
    return this.countryData.getStatesByShort(name);
  }

  
}

