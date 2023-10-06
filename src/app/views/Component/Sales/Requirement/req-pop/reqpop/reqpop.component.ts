import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  Validators,  FormGroup, FormBuilder } from '@angular/forms';
import { Availability,WorkField,RequirementStatus,RequirementType} from 'app/shared/models/req';
import { Partner } from 'app/shared/models/Partner';
import { CrudPartnerService } from '../../../partner/crudPartner.service';

@Component({
  selector: 'app-reqpop',
  templateUrl: './reqpop.component.html'
  
})
export class ReqpopComponent implements OnInit {

  public itemForm: FormGroup;;
  Availability = Object.values(Availability);
  WorkField :string []= Object.values(WorkField);
  RequirementStatus = Object.values(RequirementStatus);
  RequirementType = Object.values(RequirementType);
  listpartner : Partner [] =[];
 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReqpopComponent>,
    private fb: FormBuilder, private CrudService:CrudPartnerService

  ) { }



  buildItemForm(item){
    this.itemForm = this.fb.group({
      title : [item.title || '', Validators.required],
      description : [item.description || '', Validators.required], 
      criteria : [item.criteria || '', Validators.required],
      plannedBudget : [item.plannedBudget || '', Validators.required],
      plannedIncome : [item.plannedIncome || '', Validators.required ,],
      startDate: [item.startDate ||'', Validators.required, ],
      expectedEndDate : [item.expectedEndDate || '', Validators.required],
      responseDate : [item.responseDate || '', Validators.required],
      totalCandidateNumber : [item.totalCandidateNumber || '', Validators.required],
      requirementType : [item.requirementType || '', Validators.required],
      requirementStatus : [item.requirementStatus || '', Validators.required ,],
      workField : [item.workField || '', Validators.required],
      availability : [item.availability || '', Validators.required],
      partnerNum : [item.partnerId|| '', Validators.required],
    });
    
  }


getpartnern(){
this.CrudService.getItems().subscribe((data :any )=>{
  this.listpartner = data
});

}

  ngOnInit() {
    this.buildItemForm(this.data.payload)
     this.getpartnern()

  }

  submit() {
    
    this.dialogRef.close(this.itemForm.value)


  }

  

}
