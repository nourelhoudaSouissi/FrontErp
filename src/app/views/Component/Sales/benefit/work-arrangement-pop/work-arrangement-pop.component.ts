import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkModel } from 'app/shared/models/workArrangement';
import { BenefitService } from '../benefit.service';

@Component({
  selector: 'app-work-arrangement-pop',
  templateUrl: './work-arrangement-pop.component.html',
})
export class WorkArrangementPopComponent implements OnInit {
  public itemForm: FormGroup;
  public benefitId : number 
  workModel = Object.values(WorkModel)
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<WorkArrangementPopComponent>,
  private fb: FormBuilder,
  private crudPartnerService: BenefitService) { }
  buildItemForm(item){
    this.itemForm = this.fb.group({
      workModel : [item.workModel || '', Validators.required],
      dailyWage : [item.dailyWage || '', Validators.required], 
      workingDaysNumber : [item.workingDaysNumber|| '', Validators.required],
      
      benefitNum: [this.data.benefitId, Validators.required]
     })}
  ngOnInit(): void {
    this.benefitId = this.data.benefitId;
    this.buildItemForm(this.data.payload)
  }
  submit() {
    this.dialogRef.close(this.itemForm.value)
    this.crudPartnerService.getItemWorkArrangements(this.benefitId)
  }
}
