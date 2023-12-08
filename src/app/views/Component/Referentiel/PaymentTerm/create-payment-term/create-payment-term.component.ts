import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-payment-term',
  templateUrl: './create-payment-term.component.html',
  styleUrls: ['./create-payment-term.component.scss']
})
export class CreatePaymentTermComponent implements OnInit {

  public itemForm: FormGroup

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<CreatePaymentTermComponent>,
  private fb: FormBuilder) { }



  
  formErrorMessages = {
    title: 'Le titre est requise',
   
  };


  buildItemForm(item){
    this.itemForm = this.fb.group({
      code : [item.code || '', Validators.required],
      title : [item.title || '', Validators.required],
      description : [item.description || ''],
      
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
