import { Component, Inject, OnInit } from '@angular/core';
import { CalculationUnit } from 'app/shared/models/CalculationUnit';
import { CalculationUnitService } from '../calculation-unit.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-calculation-unit',
  templateUrl: './view-calculation-unit.component.html',
  styleUrls: ['./view-calculation-unit.component.scss']
})
export class ViewCalculationUnitComponent implements OnInit {

 
  public calculationUnit : CalculationUnit;
  public id : number;

  constructor(
    private tvaCodeService :CalculationUnitService,
    private dialog: MatDialogRef<ViewCalculationUnitComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route : ActivatedRoute) { }

    ngOnInit(): void {
      const data = this.data;
      this.calculationUnit= data.calculationUnit;
    }

    closeDialog(): void {
          this.dialog.close();
    }

}
