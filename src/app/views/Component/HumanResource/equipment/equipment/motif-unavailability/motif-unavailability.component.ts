import { DataDialogComponent } from './../../../../../../../assets/examples/material/data-dialog/data-dialog.component';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { EquipmentService } from '../../equipment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-motif-unavailability',
  templateUrl: './motif-unavailability.component.html',
  styleUrls: ['./motif-unavailability.component.scss']
})
export class MotifUnavailabilityComponent implements OnInit {
  

  public itemForm: UntypedFormGroup;
  showMotif = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MotifUnavailabilityComponent>,
    private fb: UntypedFormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private equipmentService : EquipmentService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload)  
  }


  buildItemForm(item) {
    this.itemForm = this.fb.group({
      motifUnavailability: [item.motifUnavailability || '', Validators.required],
      disponibilityDate:[item.disponibilityDate || '', Validators.required]
   })
  }



 
  
  
  submit() {
    this.dialogRef.close(this.itemForm.value)
  }
  

}
