
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
  templateUrl: './education-popup.component.html'
})

export class educationPopupComponent implements OnInit {
  employeeId : number
  updateEducation: FormGroup;
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
    public dialogRef: MatDialogRef<educationPopupComponent>,
    private fb: FormBuilder,
    private update: updateCandidatService,  
    private http: HttpClient,
    private route:ActivatedRoute 
  ) { this.countries = this.update.getCountries();}




  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];}

  ngOnInit() {
    const educationData = this.data.payload;
   // this.getemployee();
   
    this.updateEducation = new UntypedFormGroup({
      diploma: new UntypedFormControl(this.data.payload.diploma, ),
      institution: new UntypedFormControl(this.data.payload.institution, ),
      obtainedDate: new UntypedFormControl(this.data.payload.obtainedDate, ),
      startYear: new UntypedFormControl(this.data.payload.startYear),
      score: new UntypedFormControl(this.data.payload.score, []),
      actual: new UntypedFormControl(false),
      /*technicalFileNum : new UntypedFormControl(this.data.technicalFileId,),*/
      technicalFileNum : new UntypedFormControl(this.data.technicalFileId, []),
     //id: new UntypedFormControl(this.data.payload.id, [])
    });

  }

  submit() {
    this.dialogRef.close(this.updateEducation.value) }

 
  ///// Form Submit///// 
  onSubmit() {
    // Get the values of each form
    const formData = this.updateEducation.value;
    console.log('Submitting form...');
    //  if (this.myForm.valid) {
        console.log('Form is valid, submitting...');
        this.update.updateItem(this.id,this.employee).subscribe({
          next: (res) => {
            console.log('Item updated successfully', res);
           
            
            console.log('Form value', this.updateEducation.value);
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
  this.states = this.update.getStatesByCountry(countryShotName);}



buildItemForm(item: any) {
  throw new Error('Function not implemented.');
}
}
