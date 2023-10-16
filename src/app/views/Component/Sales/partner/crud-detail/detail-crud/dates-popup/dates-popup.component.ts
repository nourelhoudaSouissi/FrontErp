import { DatePipe } from '@angular/common';
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'comment-popup',
    templateUrl: './dates-popup.component.html',
  })
  export class DatesPopupComponent  {


    constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe) {}

    formatDate(date: string): string {
      return this.datePipe.transform(date, 'dd-MM-yyyy');
    }

}
  