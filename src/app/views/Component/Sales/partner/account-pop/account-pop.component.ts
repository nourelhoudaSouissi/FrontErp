import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CrudPartnerService } from '../crudPartner.service';
import { PartnerContactPopComponent } from '../partner-contact-pop/partner-contact-pop.component';

@Component({
  selector: 'app-account-pop',
  templateUrl: './account-pop.component.html'
})
export class AccountPopComponent implements OnInit {
  private partnerId : number
  public itemForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PartnerContactPopComponent>,
    private fb: FormBuilder,
    private crudPartnerService: CrudPartnerService
  ) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload)
    this.partnerId = this.data.partnerId;
  }

  buildItemForm(item){
    this.itemForm = this.fb.group({
      bankName : [item.bankName || '', Validators.required],
      rib : [item.rib || '', Validators.required],
      iban : [item.iban || '', Validators.required],
      bic : [item.bic || '', Validators.required],
      bankAddress : [item.bankAddress || '', Validators.required],
      partnerNum: [this.data.partnerId, Validators.required]
    });
  }

  submit(){
    console.log(this.itemForm.value)
    this.dialogRef.close(this.itemForm.value)
  }

}
