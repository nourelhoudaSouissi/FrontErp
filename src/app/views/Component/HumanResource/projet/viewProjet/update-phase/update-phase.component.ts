import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ProjetService } from '../../projet.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-update-phase',
  templateUrl: './update-phase.component.html',
  styleUrls: ['./update-phase.component.scss']
})
export class UpdatePhaseComponent implements OnInit {
  public itemForm: UntypedFormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdatePhaseComponent>,
    private fb: UntypedFormBuilder,
    
  ) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload)  

  }

   
  buildItemForm(item) {
      this.itemForm = this.fb.group({
        name:[item.name || '', Validators.required],
        startDate: [ item.startDate||'', Validators.required],
        endDate:[ item.endDate||'', Validators.required],
        livrable: [ item.livrable||'', Validators.required],
        description:[item.description||'', Validators.required]
   })
  }
 

  submit() {
    this.dialogRef.close(this.itemForm.value)
  }
}
