import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OfferService } from './../offer.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  Validators,  FormGroup, FormBuilder, FormArray } from '@angular/forms';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './offer-popup.component.html',
  styleUrls:  ['./offer-popup.component.scss']
})
export class OfferPopupComponent implements OnInit {
  submitted = false;
  offerForm : FormGroup;
  private offerService: OfferService
  formWidth = 200; //declare and initialize formWidth property
  formHeight = 700; //declare and initialize formHeight property
  
  selectedFile: File;

  formErrorMessages = {
    reference : 'La référence de l\'offre est requise',
    title: 'Le titre de l\'offre est requis',
    description: 'La description   est requise',
    jobSite : 'Le site est requis',
    startDate : 'La date de début est requise',
    endDate : " La date de fin est requise",
    requiredSkills : 'Les compétences demandées sont requises',
  };
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OfferPopupComponent>,
    private fb: FormBuilder,
    private crudService: OfferService,  
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }

  buildItemForm(item){
    this.offerForm = this.fb.group({
      reference : [item.reference || '', Validators.required],
      title : [item.title || '', Validators.required],
      description : [item.description || '',Validators.required] ,
      jobSite : [item.jobSite || '', Validators.required],
      startDate : [item.startDate || '', Validators.required],
      endDate : [item.endDate || '', Validators.required],
      requiredSkills: [item.requiredSkills|| '', Validators.required],
       requiredExperienceAmount : [item.requiredExperienceAmount || '',],

    });

  }


  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  submit() {
    if (this.offerForm.valid) {
      this.dialogRef.close(this.offerForm.value);
    } else {
      // Mark all the form controls as touched to display the validation messages
      this.markFormGroupTouched(this.offerForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    // Recursively mark all form controls as touched to trigger the validation
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

 
  ///// Form Submit///// 
  onSubmit() {
    // Get the values of each form
    const formData = this.offerForm.value;

    this.http.post('http://localhost:8080/rh/employee', formData)
  .pipe(
    catchError(error => {
      console.log(error);
      return of(error);
    })
  )
  .subscribe(response => {
    console.log(response);
    // Handle the response, such as displaying a success message
  });
  }

}