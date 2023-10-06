
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './ngx-table-popup-client-review.component.html'
 
})
export class NgxClientReviewTablePopupComponent implements OnInit {
  public itemForm: UntypedFormGroup;
 
 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxClientReviewTablePopupComponent>,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload)
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      id: [item.id || ''],
      date_review: [item.date_review || '', Validators.required],
      subject: [item.subject || ''],
      comment: [item.comment || ''],
      satisfaction: [item.satisfaction || ''],
      reviewtype: [item.ReviewType || '']
     
    })
  }

  submit() {
    this.dialogRef.close(this.itemForm.value)
  }

 
}
