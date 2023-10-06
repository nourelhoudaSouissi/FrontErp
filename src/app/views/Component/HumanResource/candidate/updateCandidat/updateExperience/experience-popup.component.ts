
import { Civility } from './../../../../../../shared/models/contact';
import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  Validators,  FormGroup, FormBuilder, FormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { updateCandidatService } from '../updateCandidat.service';
import { Country, Employee, MaritalSituation, Title } from 'app/shared/models/Employee';
import { LanguageLevel } from 'app/shared/models/Language';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './experience-popup.component.html'
})
export class experiencePopupComponent implements OnInit {
  technicalFileId:number;
  employeeId : number
  experienceForm: FormGroup;
  id:number;
  employee : Employee;
  Civility :string []= Object.values(Civility);
  countries: Country[];
  states: string[];
  MaritalSituation :string []= Object.values(MaritalSituation);
  title :string[]= Object.values(Title);
  LanguageLevel : string[] = Object.values(LanguageLevel);
  submitted = false;
  selectedFile: File;
  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<experiencePopupComponent>,
    private fb: FormBuilder,
    private update: updateCandidatService,  
    private http: HttpClient,
    private route:ActivatedRoute 
  ) { this.countries = this.update.getCountries();}





  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  ngOnInit() {
    this.technicalFileId=this.data.payload.technicalFileId ;
    const experienceData = this.data.payload;
   // this.getemployee();
   
    this.experienceForm = new UntypedFormGroup({
      experienceStartDate: new UntypedFormControl(this.data.payload.experienceStartDate, ),
      experienceEndDate: new UntypedFormControl(this.data.payload.experienceEndDate, ),
      technology: new UntypedFormControl(this.data.payload.technology, ),
      experienceCompany: new UntypedFormControl(this.data.payload.experienceCompany),
      experienceRole: new UntypedFormControl(this.data.payload.experienceRole, []),
      actualEmployment: new UntypedFormControl(false),
      experienceTitle: new UntypedFormControl(this.data.payload.experienceTitle, ),
      experiencePost: new UntypedFormControl(this.data.payload.experiencePost),
      /*technicalFileNum : new UntypedFormControl(this.data.technicalFileId,),*/
      technicalFileNum : new UntypedFormControl(this.data.technicalFileId, []),
     //id: new UntypedFormControl(this.data.payload.id, [])


     
     
    });

  }

  submit() {
    this.dialogRef.close(this.experienceForm.value)
   
  }

 
  ///// Form Submit///// 
  onSubmit() {
    // Get the values of each form
    const formData = this.experienceForm.value;
    console.log('Submitting form...');
    //  if (this.myForm.valid) {
        console.log('Form is valid, submitting...');
        this.update.updateItem(this.id,this.employee).subscribe({
          next: (res) => {
            console.log('Item updated successfully', res);
           
            
            console.log('Form value', this.experienceForm.value);
            this.submitted = true;
          },
          error: (e) => console.error('Error adding item', e)
        });
  }

  getemployee() {
    this.update.getItemById(this.id).subscribe((data: any) => {
      this.employee = data;

    });
  }

onCountryChange(countryShotName: string) {
  this.states = this.update.getStatesByCountry(countryShotName);
}



}

function buildItemForm(item: any) {
  throw new Error('Function not implemented.');
}