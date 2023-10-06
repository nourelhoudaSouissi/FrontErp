import { Component, Inject } from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ExperienceLevel } from 'app/shared/models/AssOfferCandidate';
import { cvcandidatComponent } from '../cv-candidat.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'dialog-elements-example-dialog',
    templateUrl: 'offerPopup.component.html',
  })

  export class OfferPopupComponent {
     offerCandidatForm:FormGroup;
    ExperienceLevel :string []= Object.values(ExperienceLevel);
constructor(    @Inject(MAT_DIALOG_DATA) public data: any,
public dialogRef : MatDialogRef<OfferPopupComponent>
){}
   
   
    ngOnInit() {

        this.offerCandidatForm = new UntypedFormGroup({
            applicationDate: new UntypedFormControl('', [Validators.required]),
            experienceLevel: new UntypedFormControl('', [Validators.required]),
            employeeNum : new UntypedFormControl(this.data.employeeId, []),
            offerNum: new UntypedFormControl(this.data.offreNum, []),
          })
    }

    ExperienceLevelMap= {
        [ExperienceLevel.JUNIOR]:'Junior',
        [ExperienceLevel.MID_LEVEL]:'Confirmé',
       [ExperienceLevel.SENIOR]:'Senior',
       [ExperienceLevel.EXPERT]:'Expert',
      };
      submit(){
        this.dialogRef.close(this.offerCandidatForm.value)     }
    
        close(): void {
          // Fermer la boîte de dialogue
          this.dialogRef.close();
        }
  }