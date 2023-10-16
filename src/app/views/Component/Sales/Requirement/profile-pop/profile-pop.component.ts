import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, UntypedFormControl, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Currency } from 'app/shared/models/Partner';
import { Availability } from 'app/shared/models/req';
import { ReqService } from '../req.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '../../partner/partner-stepper/partner-stepper.component';

@Component({
  selector: 'app-profile-pop',
  templateUrl: './profile-pop.component.html',
  styleUrls: ['./profile-pop.component.scss'],
  providers: [
    // Provide custom date format
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ProfilePopComponent implements OnInit {

  Availability = Object.values(Availability);
  requestedProfileForm: FormGroup;
  sortedCurrencies = Object.values(Currency).sort()
  submitted = false
  profileId: number
  public itemForm: FormGroup
  requirementNum: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private reqService: ReqService,
    public dialogRef: MatDialogRef<ProfilePopComponent>
  ) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload)
    console.log(this.data.payload)
  }
  

  buildItemForm(item){
    this.itemForm = this.fb.group({
      candidateNumber : [item.candidateNumber || '', Validators.required],
      function : [item.function || '', Validators.required],
      experienceYears : [item.experienceYears || '', Validators.required], 
      comment : [item.comment || '', Validators.required], 
      startDate : [item.startDate || '', Validators.required],
      endDate : [item.endDate || '', Validators.required],
      requirementNum: [this.data.requirementId, Validators.required]
    })
  }

  submit() {
    console.log(this.itemForm.value)
    this.dialogRef.close(this.itemForm.value)
  }



}