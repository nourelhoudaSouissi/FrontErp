import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Experience } from 'app/shared/models/ProfileReference';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {

  public itemForm: FormGroup
  experiences= Object.values(Experience)
  

  
  formErrorMessages = {
    function: 'La fonction est requise',
    technologie: 'La technologie est requise',
    experience: 'Le jour de début est requis',
    yearsOfExperience: 'Le nombre d\'années d\'expérience est requis',
  };
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateProfileComponent>,
    private fb: FormBuilder
  ) { }

  buildItemForm(item){
    this.itemForm = this.fb.group({
      function : [item.function || '', Validators.required],
      technologie : [item.technologie || '',Validators.required],
      experience : [item.experience || '',Validators.required],
      yearsOfExperience : [item.yearsOfExperience || '',Validators.required],
      description : [item.description || '',Validators.required]
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


  experienceMap = {
    [Experience.JUNIOR]:'Junior',
    [Experience.CONFIRMED]:'Confirmé',
    [Experience.SENIOR]:'Senior',
    [Experience.EXPERT]:'Expert'
    
  };
}
