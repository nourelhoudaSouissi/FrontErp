import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EquipmentService } from '../../equipment.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-return-equipment',
  templateUrl: './return-equipment.component.html',
  styleUrls: ['./return-equipment.component.scss']
})
export class ReturnEquipmentComponent implements OnInit {

  public itemForm: UntypedFormGroup;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReturnEquipmentComponent>,
    private fb: UntypedFormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private equipmentService : EquipmentService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {

    this.buildItemForm(this.data.equipment)

  }


  buildItemForm(item) {
    this.itemForm = this.fb.group({
      returnDate: [item?.returnDate || '', Validators.required],
      returnComment: [item?.returnComment || '', Validators.required],
      returnStatus: [item?.returnStatus || '', Validators.required]
 })
  }
 
  submit() {
    
    this.dialogRef.close(this.itemForm.value)
  }

}
