import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-holiday',
  templateUrl: './create-holiday.component.html',
  styleUrls: ['./create-holiday.component.scss']
})
export class CreateHolidayComponent implements OnInit {
  public itemForm: FormGroup

  formErrorMessages = {
    name: 'Le titre est requis',
    startDate: 'La date de début est requise',
    duration: 'La durée est requise',
    endDate: 'La dat de fin  est requise',
  };
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateHolidayComponent>,
    private fb: FormBuilder
  ) { }


  buildItemForm(item){
    this.itemForm = this.fb.group({
      name : [item.name || '', Validators.required],
      startDate : [item.startDate || '', Validators.required],
      endDate : [item.endDate || '', Validators.required],
      duration : [item.duration || '', Validators.required]
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



}
