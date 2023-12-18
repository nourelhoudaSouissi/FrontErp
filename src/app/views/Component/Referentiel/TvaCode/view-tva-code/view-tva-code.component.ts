import { Component, Inject, OnInit } from '@angular/core';
import { TvaCode } from 'app/shared/models/TvaCode';
import { TvaCodeService } from '../tva-code.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-tva-code',
  templateUrl: './view-tva-code.component.html',
  styleUrls: ['./view-tva-code.component.scss']
})
export class ViewTvaCodeComponent implements OnInit {

  
  public tvaCode : TvaCode;
  public id : number;

  constructor(
    private tvaCodeService :TvaCodeService,
    private dialog: MatDialogRef<ViewTvaCodeComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

    ngOnInit(): void {
      const data = this.data;
      this.tvaCode= data.tvaCode;
    }

    closeDialog(): void {
          this.dialog.close();
    }

}
