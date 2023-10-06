import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DayOfWeek } from 'app/shared/models/weekend';

@Component({
  selector: 'app-create-weekend',
  templateUrl: './create-weekend.component.html',
  styleUrls: ['./create-weekend.component.scss']
})
export class CreateWeekendComponent implements OnInit {

  public itemForm: FormGroup
  dayOfWeek= Object.values(DayOfWeek)
  

  
  formErrorMessages = {
    reference: 'La référence est requise',
    name: 'Le titre est requis',
    startDay: 'Le jour de début est requis',
    endDay: 'Le jour de fin  est requis',
  };
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateWeekendComponent>,
    private fb: FormBuilder
  ) { }

  buildItemForm(item){
    this.itemForm = this.fb.group({
      reference : [item.reference || '', Validators.required],
      name : [item.name || '',Validators.required],
      startDay : [item.startDay || '',Validators.required],
      endDay : [item.endDay || '',Validators.required]
    })
  }


  ngOnInit(): void {
    this.buildItemForm(this.data.payload)
  }


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

 
  

  dayOfWeekMap = {
    [DayOfWeek.MONDAY]:'Lundi',
    [DayOfWeek.TUESDAY]:'Mardi',
    [DayOfWeek.WEDNESDAY]:'Mercredi',
    [DayOfWeek.THURSDAY]:'Jeudi',
    [DayOfWeek.FRIDAY]:'Vendredi',
    [DayOfWeek.SATURDAY]:'Samedi',
    [DayOfWeek.SUNDAY]:'Dimanche'
    
  };


}
