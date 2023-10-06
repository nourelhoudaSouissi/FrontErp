import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service'; 

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  signupForm: FormGroup;
  emailConfirmed = false;
  confirmationToken: string;

  constructor(
    private jwtAuthService: JwtAuthService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.confirmationToken = params['confirmationToken'];
      this.confirmation();
      const password = new FormControl('', Validators.required);
      this.signupForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: password,
        agreed: new FormControl('', (control: FormControl) => {
          const agreed = control.value;
          if (!agreed) {
            return { agreed: true };
          }
          return null;
        })
      });
    });
  }

  signup() {
    if (this.signupForm.valid) {
      const signupData = this.signupForm.value;
      this.progressBar.mode = 'indeterminate';
      this.submitButton.disabled = true;
      this.http.post('http://localhost:8085/api/auth/signup/customer', signupData).subscribe(
        (response: any) => {
          this.progressBar.mode = 'determinate';
          alert(response.message +'/'+ 'Please confirm your email');
          this.router.navigateByUrl('sessions/signin');
        },
        (error: any) => {
          this.progressBar.mode = 'determinate';
          alert(error.error.message);
          this.submitButton.disabled = false;
        }
      );
    }
  }

  confirmation() {
    if (this.confirmationToken) {
      this.jwtAuthService.confirmUser(this.confirmationToken).subscribe(
        (response: any) => {
          this.emailConfirmed = true;
        },
        (error: any) => {
        }
      );
    }
  }
}
