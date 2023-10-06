import { MotifUnavailability } from './../../../../../shared/models/availability';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { ResourceService } from '../resource.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { differenceInDays } from 'date-fns';

@Component({
  selector: 'app-update-availability',
  templateUrl: './update-availability.component.html',
  styleUrls: ['./update-availability.component.scss']
})
export class UpdateAvailabilityComponent implements OnInit {

  public itemForm: UntypedFormGroup;
  showMotif = false;
 
  formErrorMessages = {
    employeeNum:'le num est requis',
    startDate: 'La date de début est requise',
    endDate: 'La date de fin est requise',
    period:'La période est requise',
    
  };
  MotifUnavailability = Object.values( MotifUnavailability).filter((element) => {
    return isNaN(Number(element));
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateAvailabilityComponent>,
    private fb: UntypedFormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private resourceService : ResourceService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload)  


 
 if (this.itemForm.controls['startDate'].value && this.itemForm.controls['endDate'].value) {
  this.calculatePeriod();
}
  }

  
  buildItemForm(item) {
      this.itemForm = this.fb.group({
        employeeNum:[this.data.id || '', Validators.required],
        startDate: [ item.startDate||'', Validators.required],
        endDate:[ item.endDate||'', Validators.required],
        period:[item.period ||'', Validators.required],
        motifUnavailability:[item.motifUnavailability ||'', Validators.required],
        comment:[item.comment||'', ]
   })
  }


/************************************ End ngOnInit ************************************/

  calculatePeriod() {
    const startDate = this.itemForm.controls['startDate'].value;
    const endDate = this.itemForm.controls['endDate'].value;
  
    if (startDate && endDate) {
      const days = differenceInDays(new Date(endDate), new Date(startDate));
      this.itemForm.controls['period'].setValue(days);
    }
  }
  
  
  

  submit() {
    this.dialogRef.close(this.itemForm.value)
  }
  /*
  submit() {
    if (this.itemForm.valid) {
      // Effectuez vos actions ici (par exemple, fermeture de la boîte de dialogue, envoi au service, etc.)
      this.dialogRef.close(this.itemForm.value);
    } else {
      // Mark all the form controls as touched to display the validation messages
      this.markFormGroupTouched(this.itemForm);
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
  */
  MotifUnavailabilityMap  = {
    [MotifUnavailability.DISEASE]: 'Maladie',
    [MotifUnavailability.TRAINING]: 'Formation',
    [MotifUnavailability.PROJECT]: 'Projet',
    [MotifUnavailability.LEAVE]: 'Congé'
  };
}
 