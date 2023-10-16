import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Privilege, Civility } from 'app/shared/models/contact';
import { CrudPartnerService } from '../crudPartner.service';

@Component({
  selector: 'app-partner-contact-pop',
  templateUrl: './partner-contact-pop.component.html'
})
export class PartnerContactPopComponent implements OnInit {
  private partnerId : number
  public itemForm: FormGroup;
  Privilege :string []= Object.values(Privilege);
  Civility :string []= Object.values(Civility);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<PartnerContactPopComponent>,
  private fb: FormBuilder,
  private crudPartnerService: CrudPartnerService) { }

  ngOnInit(): void {
    console.log(this.data.payload)
    this.buildItemForm(this.data.payload)
    this.partnerId = this.data.partnerId;
  }

  buildItemForm(item){
    this.itemForm = this.fb.group({
      firstName : [item.firstName || '', Validators.required],
      lastName : [item.lastName || '', Validators.required],
      fullName : [item.fullName || '', Validators.required],
      function : [item.function || '', Validators.required],
      email : [item.email || '', Validators.required],
      mobilePhoneNumber : [item.mobilePhoneNumber || '', Validators.required],
      phoneNumber : [item.phoneNumber || '', Validators.required],
      comment : [item.comment || '', Validators.required],
      privilege : [item.privilege || '', Validators.required],
      civility : [item.civility || '', Validators.required],
      service : [item.service || '', Validators.required],
      partnerNum: [this.data.partnerId, Validators.required]
    });
  }

  submit() {
    this.dialogRef.close(this.itemForm.value)
    console.log(this.itemForm.value)
  }

  PrivilegeMap = {
    [Privilege.HIGH]:'Elevé',
    [Privilege.MEDIUM]:'Moyen',
    [Privilege.LOW] : 'Faible'
  }

  CivilityMap = {
    [Civility.MR]:'Mr',
    [Civility.MRS]:'Mme',
    [Civility.MS] : 'Mlle'   
  }
}
