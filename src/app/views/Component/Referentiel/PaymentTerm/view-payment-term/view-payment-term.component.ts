import { Component, OnInit, Inject } from '@angular/core';
import { PaymentTerm } from 'app/shared/models/PaymentTerm';
import { PaymentTermService } from '../payment-term.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-payment-term',
  templateUrl: './view-payment-term.component.html',
  styleUrls: ['./view-payment-term.component.scss']
})
export class ViewPaymentTermComponent implements OnInit {

  public paymentTerm : PaymentTerm;
  public id : number;

  constructor(
    private paymentTermService :PaymentTermService,
    private dialog: MatDialogRef<ViewPaymentTermComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

    ngOnInit(): void {
     
      const data = this.data;
      this.paymentTerm= data.paymentTerm;
      console.log("paymentTerm", this.paymentTerm)
      console.log("paymentTerm data", data.paymentTerm)
   
    }

    closeDialog(): void {
          this.dialog.close();
    }

}
