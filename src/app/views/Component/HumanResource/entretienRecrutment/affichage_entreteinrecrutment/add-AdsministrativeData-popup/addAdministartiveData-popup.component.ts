import { AvailabilityEnum, ContractTitle} from './../../../../../../shared/models/AdministrativeData';
import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators,  FormGroup, FormBuilder, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { entretienRecrutmentService } from '../../entretienRecrutment.service';
import { Employee } from 'app/shared/models/Employee';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './addAdministartiveData-popup.component.html',
  styleUrls:  ['./addAdministartiveData-popup.component.scss']
})





export class addAdminstrativeDataComponent implements OnInit {
  
  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  administrativeDataForm : FormGroup;
  formWidth = 200; //declare and initialize formWidth property
  formHeight = 500; //declare and initialize formHeight property

  ////////////////Interview Form/////////////
  contractTitle :string []= Object.values(ContractTitle);
  availability :string []= Object.values(AvailabilityEnum);

  employee:Employee;


  selectedFile: File;


  formErrorMessages = {
    contractTitle: 'Le champ est requis',
    availability: 'La disponibilité est requise',
    availabilityDate: 'La date de disponibilité est requise',
    expectedSalary: 'Le salaire  est requis',
   

  };

  constructor( 
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<addAdminstrativeDataComponent>,
    private fb: FormBuilder,
    private entretien : entretienRecrutmentService,  
    private http: HttpClient
  ) { }


  ngOnInit() {
    this.administrativeDataForm = new UntypedFormGroup({
      
      contractTitle: new UntypedFormControl('', [Validators.required]),
      currentSalary: new UntypedFormControl('', []),
      expectedSalary: new UntypedFormControl('', [Validators.required]),
      availability: new UntypedFormControl('', [Validators.required]),
      availabilityDate: new UntypedFormControl('', [Validators.required]),
      employeeNum:new UntypedFormControl('',[])
    })
    
  }/*
    submit() {
    this.dialogRef.close(this.administrativeDataForm.value)
  }*/
 
  submit() {
    if (this.administrativeDataForm.valid) {
      this.dialogRef.close(this.administrativeDataForm.value);
    } else {
      // Mark all the form controls as touched to display the validation messages
      this.markFormGroupTouched(this.administrativeDataForm);
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

  saveInterview(): void {
    console.log('Submitting cv form...');
    this.entretien.addInterview({...this.administrativeDataForm.value}).subscribe({
      next: (res) => {
        console.log('Item added successfully', res);
        console.log('Form value', this.administrativeDataForm.value);
        this.submitted = true; 
      },   
      error: (e) => {
        console.error('Error adding item', e);
        console.log('cv Form is invalid');
        console.log(this.administrativeDataForm.errors);
      }
    });
  }

  /*saveInterview(): void {
    this.entretien.addInterview(this.offerForm.value).subscribe(
        response => {
          console.log('Interview saved successfully!');
          console.log(response); // if you want to see the response from the server
        },
        error => {
          console.error('Error saving interview: ', error);
        }
      );
  }*/


  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  /*submit() {
    this.dialogRef.close(this.offerForm.value)
  }*/

 
  ///// Form Submit///// 
  onSubmit() {
    // Get the values of each form
    const formData = this.administrativeDataForm.value;

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

  ContractTitleMap = {
    [ContractTitle.PERMANENT_EMPLOYMENT_CONTRACT]: 'Contrat de travail à durée indéterminée',
    [ContractTitle.FIXED_TERM_EMPLOYMENT_CONTRACT]: 'Contrat de travail à durée déterminée',
    [ContractTitle.PROFESSIONALIZATION_CONTRACT]: 'Contrat de professionnalisation',
    [ContractTitle.SEASONAL_WORK_CONTRACT]: 'Contrat de travail saisonnier',
    [ContractTitle.PART_TIME_WORK_CONTRACT]: 'Contrat de travail à temps partiel',
    [ContractTitle.STUDY_CONTRACT]: 'Contrat d\'alternance',
    [ContractTitle.TEMPORARY_WORK_CONTRACT]: 'Contrat de travail intérimaire'
  };

  AvailabilityMap = {
  [AvailabilityEnum.ASAP]: 'ASAP',
  [AvailabilityEnum.IMMEDIATELY]: 'Immédiatement',
  [AvailabilityEnum.MONTH_MAXIMUM]: 'Un mois maximum',
  [AvailabilityEnum.THREE_MONTHS_MAXIMUM]: '3 Mois maximum',
}

weekendFilter = (d: Date | null): boolean => {
  const day = (d || new Date()).getDay();
  // Prevent Saturday and Sunday from being selected.
  return day !== 0 && day !== 6;
};


closeDialog(): void {
  // Fermer la boîte de dialogue
  this.dialogRef.close();
}


}