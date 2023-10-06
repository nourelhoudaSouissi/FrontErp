import { Injectable } from "@angular/core";
import { LocalStoreService } from "../local-store.service";
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { map, catchError, delay } from "rxjs/operators";
import { User } from "../../models/user.model";
import { of, BehaviorSubject, throwError, Observable, ReplaySubject, Subject } from "rxjs";
import { environment } from "environments/environment";
import { ApiResponse } from "./ApiResponse";
import { Role } from "../../models/user.model";

// ================= only for demo purpose ===========

// ================= you will get those data from server =======

@Injectable({
  providedIn: "root",
})
export class JwtAuthService {
  token;
  roles : any 
  isAuthenticated: Boolean;
  user: User = {};
  user$ = (new BehaviorSubject<User>(this.user));
  signingIn: Boolean;
  baseUrl ="http://localhost:8085/api/auth";
  return: string;
  JWT_TOKEN = "JWT_TOKEN";
  APP_USER = "EGRET_USER";
  APP_Role = "Role_USER";

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.getJwtToken()
    })
  };



  constructor(
    private ls: LocalStoreService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams
      .subscribe(params => this.return = params['return'] || '/');
  }

  updateCustomerRole(customerId: number, roleName: string): Observable<ApiResponse> {
    const url = `${this.baseUrl}/customers/${customerId}/role?roleName=${roleName}`;
    const token = localStorage.getItem('JWT_TOKEN');
    const headers = { Authorization: `Bearer ${token}` };
    console.log(headers)
    console.log(roleName)
    return this.http.put<ApiResponse>(url, null, { headers });
  }
  
  


  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles`);
  }




  public signin(username, password): Observable<any> {
    this.signingIn = true;
    const url = `${this.baseUrl}/signin`;
    return this.http.post(url, { username, password })
      .pipe(
        map((res: any) => {
          console.log('JWT token:', res.token);
          console.log('User roles:', res.roles);
          this.setUserAndToken(res.token, res.username, !res, res.roles);
          this.signingIn = false;
          return res;
        }),
        catchError((error: any) => {
          alert(error.error.message);
          this.signingIn = false;
          return throwError(error);
        })
      );
  }

  setUserAndToken(token: string, user: User, isAuthenticated: boolean, roles: string[]) {
    this.isAuthenticated = isAuthenticated;
    this.token = token;
    this.user = user;
    this.roles = roles;
  
    this.user$.next(user);
    this.ls.setItem(this.JWT_TOKEN, token);
    this.ls.setItem(this.APP_USER, user);
    this.ls.setItem(this.APP_Role, JSON.stringify(roles)); // Store the roles as a stringified JSON array
  }
  private clearLocalStorage(): void {
    this.ls.clear();
  }


  
  public signout(): Observable<any> {
    this.clearLocalStorage();
    
    localStorage.removeItem('roles')
    this.router.navigateByUrl('sessions/signin');
    return this.http.post<any>(`${this.baseUrl}/signout`, null);
  }




  isLoggedIn(): Boolean {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return this.ls.getItem(this.JWT_TOKEN);
  }
  getUser() {
    return this.ls.getItem(this.APP_USER);
  }


  public getLocalStorage(): LocalStoreService {
    return this.ls;
  }
  
  getImage(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}/image`, { responseType: 'blob' });
  }

  getAllCustomersForUser(userId: number): Observable<User[]> {
    const url = `${this.baseUrl}/${userId}/customers`;
    return this.http.get<User[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }




  resetPassword(passwordResetToken: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('passwordResetToken', passwordResetToken)
      .set('password', password);
    return this.http.post(`${this.baseUrl}/reset-password`, null, { params });
  }


  confirmUser(confirmationToken: string): Observable<any> {
    const url = `${this.baseUrl}/confirm?confirmationToken=${confirmationToken}`;
    return this.http.get<any>(url);
  }
  completeProfile(completProfileRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/completeProfile`, completProfileRequest);
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${username}`);
  }


  uploadImage(userId: number, file: File): Observable<number> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const req = new HttpRequest('POST', `${this.baseUrl}/${userId}/image`, formData, {
      reportProgress: true
    });

    return this.http.request(req).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((100 * event.loaded) / event.total);
          return percentDone;
        } else if (event instanceof HttpResponse) {
          return 100;
        }
      })
    );
  }
  

  

  
  registerCustomerUser(signupRequest: any, customerId: number): Observable<any> {
    const body = {
      username: signupRequest.username,
      email: signupRequest.email,
      password: signupRequest.password
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    const params = { customerId: customerId.toString() };
  
    return this.http.post(`${this.baseUrl}/signup/customer-user`, body, { headers, params });
  }
  deleteCustomer(userId: number, customerId: number): Observable<any> {
    const url = `${this.baseUrl}/${userId}/customers/${customerId}`;
    return this.http.delete(url);
  }
  forgotPassword(email: string): Observable<any> {
    const url = `${this.baseUrl}/forgot-password?email=${email}`;
    return this.http.post(url, {});
   
  }


}