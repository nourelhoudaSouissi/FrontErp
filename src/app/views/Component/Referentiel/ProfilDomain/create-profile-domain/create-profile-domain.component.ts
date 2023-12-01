import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-profile-domain',
  templateUrl: './create-profile-domain.component.html',
  styleUrls: ['./create-profile-domain.component.scss']
})
export class CreateProfileDomainComponent implements OnInit {
  public itemForm: FormGroup

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<CreateProfileDomainComponent>,
  private fb: FormBuilder) { }



  
  formErrorMessages = {
    reference: 'Le titre est requise',
   
  };


  buildItemForm(item){
    this.itemForm = this.fb.group({
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
