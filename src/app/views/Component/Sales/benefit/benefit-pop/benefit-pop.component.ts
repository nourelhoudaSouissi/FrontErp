import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BenefitStatus } from 'app/shared/models/Benefit';
import { BenefitService } from '../benefit.service';

@Component({
  selector: 'app-benefit-pop',
  templateUrl: './benefit-pop.component.html'
})
export class BenefitPopComponent implements OnInit {

  public itemForm: FormGroup
  benefitStatus = Object.values(BenefitStatus)
 
 
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BenefitPopComponent>,
    private fb: FormBuilder, private benefitService: BenefitService
  ) { }

  buildItemForm(item){
    this.itemForm = this.fb.group({
      titled : [item.titled || '', Validators.required],
      benefitStatus : [item.benefitStatus || '', Validators.required],
      averageDailyCost : [item.averageDailyCost || '', Validators.required],
      totalCost : [item.totalCost || '', Validators.required],
      cost : [item.cost || '', Validators.required],
      costEfficiency : [item.costEfficiency || '', Validators.required],
      exceptionalCosts : [item.exceptionalCosts || false],
      monthlyFees : [item.monthlyFees || '', Validators.required],
    })
  }

  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }

  submit() {
    console.log(this.itemForm.value)
    this.dialogRef.close(this.itemForm.value)
  }
  benefitStatusMap = {
    [BenefitStatus.SIGNED]:'Signé',
    [BenefitStatus.PROVISIONAL]:'Provisoire'
  };
}
