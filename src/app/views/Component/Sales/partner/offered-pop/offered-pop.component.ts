import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiceType } from 'app/shared/models/offeredService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudPartnerService } from '../crudPartner.service';
import { PartnerContactPopComponent } from '../partner-contact-pop/partner-contact-pop.component';

@Component({
  selector: 'app-offered-pop',
  templateUrl: './offered-pop.component.html'
})
export class OfferedPopComponent implements OnInit {
  private partnerId : number
  public itemForm: FormGroup;
  serviceTypes: string[]= Object.values(ServiceType);

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
      serviceType : [item.serviceType || '', Validators.required],
      title : [item.title || '', Validators.required],
      partnerNum: [this.data.partnerId, Validators.required]
    });
  }

  submit(){
    this.dialogRef.close(this.itemForm.value)
  }
}
