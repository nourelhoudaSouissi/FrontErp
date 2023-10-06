import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimeOffType } from 'app/shared/models/leaveType';
import { LeaveTypeService } from '../leave-type.service';

@Component({
  selector: 'app-create-leave-type',
  templateUrl: './create-leave-type.component.html',
  styleUrls: ['./create-leave-type.component.scss']
})
export class CreateLeaveTypeComponent implements OnInit {
  public itemForm: FormGroup
  timeOffType= Object.values(TimeOffType)


  formErrorMessages = {
    name: 'Le titre est requis',
    timeOffType: 'Le type  est requis',
    duration: 'La nombre de jours est requis',
    alertNumberDays: 'L\'alerte  est requise',
   

  };
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateLeaveTypeComponent>,
    private fb: FormBuilder
  ) { }


  buildItemForm(item){
    this.itemForm = this.fb.group({
      name : [item.name || '', Validators.required],
      timeOffType : [item.timeOffType || '', Validators.required],
      duration : [item.duration || '', Validators.required],
      alertNumberDays: [item.alertNumberDays || '', Validators.required],
      description : [item.description || '', ]
    })
  }


  ngOnInit(): void {
    this.buildItemForm(this.data.payload)
  }

/*
  submit() {
    console.log(this.itemForm.value)
    this.dialogRef.close(this.itemForm.value)
  }*/


  submit() {
    if (this.itemForm.valid) {
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
  timeOffTypeMap = {
    [TimeOffType.UNPAIED_TIME_OFF]:'Congé sans solde',
    [TimeOffType.PAID_LEAVE]:'Congé payé',
    [TimeOffType.SICKNESS_LEAVE]:'Congé de maladie',
    [TimeOffType.SPECIAL_PAID_LEAVE]:'Congé spécial payé',
    [TimeOffType.OTHER]:'Autre'   
  };


}
