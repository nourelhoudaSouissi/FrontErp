import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators,  FormGroup, FormBuilder, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { entretienRecrutmentService } from '../../entretienRecrutment.service';
import { Interview, InterviewMode, InterviewType, interviewLocation } from 'app/shared/models/Interview';
import { Employee } from 'app/shared/models/Employee';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './addEntretien-popup.component.html',
  styleUrls:  ['./addEntretien-popup.component.scss']
})
export class ajoutEntretienPopupComponent implements OnInit {
  
  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  offerForm : FormGroup;
  formWidth = 200; //declare and initialize formWidth property
  formHeight = 700; //declare and initialize formHeight property

  ////////////////Interview Form/////////////
  interviewType :string []= Object.values(InterviewType);
  interviewMode :string []= Object.values(InterviewMode);
  interviewlocation:string []= Object.values(interviewLocation);
  interview: Interview;
  employee:Employee;


  selectedFile: File;

  formErrorMessages = {
    interviewDate: 'Le champ est requis',
    interviewType: 'Le champ est requis',
    interviewMode: 'Le champ est requis',
    interviewerEmail: 'Le champ  est requis',
    interviewerName: 'Le champ  est requis',
    interviewTime : 'Le champ  est requis',

   

  };
  constructor( 
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ajoutEntretienPopupComponent>,
    private fb: FormBuilder,
    private entretien : entretienRecrutmentService,  
    private http: HttpClient
  ) { }


  ngOnInit() {
    this.offerForm = new UntypedFormGroup({
      
      interviewDate: new UntypedFormControl('', [Validators.required]),
      comment: new UntypedFormControl('', []),
      interviewType: new UntypedFormControl('', [Validators.required]),
      duration: new UntypedFormControl('', []),
      interviewMode: new UntypedFormControl('', [Validators.required]),
      interviewerName: new UntypedFormControl('', [Validators.required]),
      interviewerEmail: new UntypedFormControl('', [Validators.email]),
      interviewerPhoneNumber: new UntypedFormControl('', [Validators.pattern(/^[0-9]*$/)]),
      interviewTime: new UntypedFormControl('', [Validators.required]),
      interviewlocation: new UntypedFormControl('', []),
      interviewPlace: new UntypedFormControl('', []),
      coefficient:new UntypedFormControl('', [Validators.required]),
      evaluationNum:new UntypedFormControl('',[])
    })
    
  }/*
    submit() {
    this.dialogRef.close(this.offerForm.value)
  }*/
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

  saveInterview(): void {
    console.log('Submitting cv form...');
    this.entretien.addInterview({...this.offerForm.value}).subscribe({
      next: (res) => {
        console.log('Item added successfully', res);
        console.log('Form value', this.offerForm.value);
        this.submitted = true; 
      },   
      error: (e) => {
        console.error('Error adding item', e);
        console.log('cv Form is invalid');
        console.log(this.offerForm.errors);
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

InterviewModeMap = {
  [InterviewMode.REMOTE]: 'À distance',
  [InterviewMode.ON_SITE]: 'Sur place',
  [InterviewMode.PHONE_INTERVIEW]: 'Téléphonique',
  [InterviewMode.VIDEOCONFERENCE]: 'Visioconférence',
}


  InterviewTypeMap = {
  [InterviewType.TECHNICAL_INTERVIEW]: 'Entretien technique',
  [InterviewType.HUMAN_RESOURCE_INTERVIEW]: 'Entretien ressources humaines'
}
interviewLocationMap={
  [interviewLocation.INTERNAL]: 'Interne',
  [interviewLocation.EXTERNAL]: 'Externe'
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