import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service'; 

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  successMessage: string;
  errorResponseMessage: string;
  isPasswordReset = false;
  passwordResetToken: string;

  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  constructor(
    private jwtAuthService: JwtAuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.passwordResetToken = params['passwordResetToken'];
      if (!this.passwordResetToken) {
       
        this.router.navigateByUrl('sessions/forgot-password');
      }
      console.log(this.passwordResetToken)
    });
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;
    return password === confirmPassword ? null : { notSame: true };
  }

  submitResetPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const password = this.resetPasswordForm.get('password').value;

    this.jwtAuthService.resetPassword(this.passwordResetToken, password).subscribe(
      (response: any) => {
        this.isPasswordReset = true;
        this.successMessage = response.message;
        this.router.navigateByUrl('sessions/signin');
      },
      (error: any) => {
        if (this.submitButton) {
          this.submitButton.disabled = false;
        }
        if (this.progressBar) {
          this.progressBar.mode = 'indeterminate';
        }
        this.errorResponseMessage = error.error.message || 'An error occurred. Please try again.';
      }
    );
  
    if (this.submitButton) {
      this.submitButton.disabled = true;
    }
    if (this.progressBar) {
      this.progressBar.mode = 'indeterminate';
    }
  }
}