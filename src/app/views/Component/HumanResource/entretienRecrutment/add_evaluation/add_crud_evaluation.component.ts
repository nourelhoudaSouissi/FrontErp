import { coerceNumberProperty } from '@angular/cdk/coercion';


import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { NgxTablePopupComponent } from 'app/views/cruds/crud-ngx-table/ngx-table-popup/ngx-table-popup.component';
import { Subscription } from 'rxjs';
import { CrudService } from '../../candidate/CandidatCrud/candidat-crud.service';
import { MatSlider } from '@angular/material/slider';


@Component({
  selector: 'evaluation-form',
  templateUrl: './add_evaluation.component.html'
})
export class crudEvaluationComponent implements OnInit {


  disabled = false;
  value = 0;
  max = 10;


  @ViewChild('slider') slider: MatSlider;
  @ViewChild('input') input: any;


save() {
    this.slider.disabled = true;
    this.slider.color = 'warn';
    this.input.nativeElement.disabled = true;
    

  }

  modify(){
    this.slider.disabled=false;
    this.input.nativeElement.disabled= false ;
  }
  
 
  panelOpenState = false;
  
  
  constructor() { }

  ngOnInit() {
  }

}

