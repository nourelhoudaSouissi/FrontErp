import { MotifUnavailability } from './../../../../../shared/models/availability';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ResourceService } from '../resource.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { differenceInDays } from 'date-fns';


@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit {

 
  public itemForm: UntypedFormGroup;
  showMotif = false;
 
  formErrorMessages = {
    startDate: 'La date de début est requise',
    endDate: 'La date de fin est requise',
    period:'La période est requise',
    motifUnavailability:'La cause est requise'

  };
 MotifUnavailability = Object.values( MotifUnavailability).filter((element) => {
    return isNaN(Number(element));
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AvailabilityComponent>,
    private fb: UntypedFormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private resourceService : ResourceService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {

    this.itemForm = this.fb.group({
      employeeNum:[this.data.id || '', Validators.required],
      startDate: [ '', Validators.required],
      endDate:[ '', Validators.required],
      period:[ '', Validators.required],
      motifUnavailability:['', Validators.required],
      comment:['',]
 })


 
 if (this.itemForm.controls['startDate'].value && this.itemForm.controls['endDate'].value) {
  this.calculatePeriod();
}
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
  
  
  
/*
  submit() {

    console.log(this.itemForm.value);
    
    this.resourceService.addAvailability(this.itemForm.value).subscribe(
      (updatedData: any) => {

        this.dialogRef.close(true);
        this.snack.open('Indisponibilité ajoutée avec succès!', 'OK', { duration: 4000 });
      },
      (error: any) => {
        this.loader.close();
        //this.snack.open('Une erreur s\'est produite lors de l\'affectation de l\'équipement.', 'OK', { duration: 4000 });
      }
    );
    
  }*/

  submit() {
    if (this.itemForm.valid) {
      console.log(this.itemForm.value);
      
      this.resourceService.addAvailability(this.itemForm.value).subscribe(
        (updatedData: any) => {
          this.dialogRef.close(true);
          this.snack.open('Indisponibilité ajoutée avec succès!', 'OK', { duration: 4000 });
        },
        (error: any) => {
          this.loader.close();
          //this.snack.open('Une erreur s\'est produite lors de l\'affectation de l\'équipement.', 'OK', { duration: 4000 });
        }
      );
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
  

  MotifUnavailabilityMap  = {
    [MotifUnavailability.DISEASE]: 'Maladie',
    [MotifUnavailability.TRAINING]: 'Formation',
    [MotifUnavailability.PROJECT]: 'Projet',
    [MotifUnavailability.LEAVE]: 'Congé'
  };
  
}
 