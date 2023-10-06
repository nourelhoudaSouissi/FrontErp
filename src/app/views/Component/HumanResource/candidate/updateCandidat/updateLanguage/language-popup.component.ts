
import { Civility } from './../../../../../../shared/models/contact';
import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  Validators,  FormGroup, FormBuilder, FormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { updateCandidatService } from '../updateCandidat.service';
import { Country, Employee, MaritalSituation, Title } from 'app/shared/models/Employee';
import { Language, LanguageLevel, Languages } from 'app/shared/models/Language';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './language-popup.component.html'
})
export class languagePopupComponent implements OnInit {
  technicalFileId:number;
  employeeId : number
  languageForm: FormGroup;
  id:number;
  employee : Employee;
  Civility :string []= Object.values(Civility);
  countries: Country[];
  states: string[];
  MaritalSituation :string []= Object.values(MaritalSituation);
  title :string[]= Object.values(Title);
  Languages : string[] = Object.values(Languages);
  LanguageLevel : string[] = Object.values(LanguageLevel);
  submitted = false;
  selectedFile: File;
  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<languagePopupComponent>,
    private fb: FormBuilder,
    private update: updateCandidatService,  
    private http: HttpClient,
    private route:ActivatedRoute 
  ) { this.countries = this.update.getCountries();}



  /*buildItemForm(item){
    this.offerForm = this.fb.group({
      reference : [item.reference || '', Validators.required],
      title : [item.title || '', Validators.required],
      description : [item.description || '', Validators.required]
    });

  }*/

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  ngOnInit() {
    this.technicalFileId=this.data.payload.technicalFileId ;
    const experienceData = this.data.payload;
   // this.getemployee();
   
    this.languageForm = new UntypedFormGroup({
      language: new UntypedFormControl(this.data.payload.language, []),
      additionalInformation: new UntypedFormControl(this.data.payload.additionalInformation, ),
      languageLevel: new UntypedFormControl(this.data.payload.languageLevel,[] ),
      /*technicalFileNum : new UntypedFormControl(this.data.technicalFileId,),*/
      technicalFileNum : new UntypedFormControl(this.data.technicalFileId, []),
     //id: new UntypedFormControl(this.data.payload.id, [])
    });

  }

  submit() {
    this.dialogRef.close(this.languageForm.value)
   
  }

 
  ///// Form Submit///// 
  onSubmit() {
    // Get the values of each form
    const formData = this.languageForm.value;
    console.log('Submitting form...');
    //  if (this.myForm.valid) {
        console.log('Form is valid, submitting...');
        this.update.updateItem(this.id,this.employee).subscribe({
          next: (res) => {
            console.log('Item updated successfully', res);
           
            
            console.log('Form value', this.languageForm.value);
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

LanguageLevelMap = {
  [LanguageLevel.BEGINNER_A1]: 'Niveau Débutant A1',
  [LanguageLevel.BEGINNER]: 'Niveau Débutant',
  [LanguageLevel.ELEMENTARY_A2]: 'Niveau Elémentaire A2',
  [LanguageLevel.BASIC]: 'Niveau de Base',
  [LanguageLevel.INTERMEDIATE_B1]: 'Niveau Intermédiaire B1',
  [LanguageLevel.INTERMEDIATE]: 'Niveau Intermédiaire',
  [LanguageLevel.UPPER_INTERMEDIATE_B2]: 'Niveau Intermédiaire Supérieur B2',
  [LanguageLevel.PROFESSIONAL]: 'Niveau Professionnel',
  [LanguageLevel.ADVANCED_C1]: 'Niveau Avancé C1',
  [LanguageLevel.FLUENT]: 'Courant',
  [LanguageLevel.PROFICIENT_C2]: 'Niveau Expert C2',
  [LanguageLevel.NATIVE_LANGUAGE]: 'Langue Maternelle',
  [LanguageLevel.BILINGUAL]: 'Bilingue'
};

}

function buildItemForm(item: any) {
  throw new Error('Function not implemented.');
}