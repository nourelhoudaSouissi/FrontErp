import { Component, Inject, OnInit } from '@angular/core';
import { Holiday } from 'app/shared/models/holiday';
import { HolidayService } from '../holiday.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-holiday',
  templateUrl: './view-holiday.component.html',
  styleUrls: ['./view-holiday.component.scss']
})
export class ViewHolidayComponent implements OnInit {

  public holiday : Holiday;
  public id : number;

  constructor(
    private holidayService :HolidayService,
    private dialog: MatDialogRef<ViewHolidayComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

    ngOnInit(): void {
      const data = this.data;
      this.holiday= data.holiday;
    }

    closeDialog(): void {
          this.dialog.close();
    }

}
