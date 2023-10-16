import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { addAddressComponent } from '../../add-address/add-address.component';
import { CrudPartnerService } from '../../partner/crudPartner.service';
import { BenefitService } from '../benefit.service';
import { ExtraDutyType } from 'app/shared/models/extraDuty';
@Component({
  selector: 'app-extra-duty-pop',
  templateUrl: './extra-duty-pop.component.html',
})
export class ExtraDutyPopComponent implements OnInit {
  public itemForm: FormGroup;
  public benefitId : number 
  extraDutyType = Object.values(ExtraDutyType)
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ExtraDutyPopComponent>,
  private fb: FormBuilder,
  private crudPartnerService: BenefitService) { }
  buildItemForm(item){
    this.itemForm = this.fb.group({
      workingHoursNumber : [item.workingHoursNumber || '', Validators.required],
      hourWage : [item.HourWage || '', Validators.required], 
      performanceBonus : [item.performanceBonus|| '', Validators.required],
      extraDutyType : [item.extraDutyType||'', Validators.required],
      benefitNum: [this.data.benefitId, Validators.required]
     })}
  ngOnInit(): void {
    this.benefitId = this.data.benefitId;
    this.buildItemForm(this.data.payload)
}
submit() {
  this.dialogRef.close(this.itemForm.value)
  this.crudPartnerService.getItemExtraDuties(this.benefitId)
}

}
