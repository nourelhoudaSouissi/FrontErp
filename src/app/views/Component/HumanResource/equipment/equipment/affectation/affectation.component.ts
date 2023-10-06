import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { EquipmentService } from '../../equipment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Employee } from 'app/shared/models/Employee';

@Component({
  selector: 'app-affectation',
  templateUrl: './affectation.component.html',
  styleUrls: ['./affectation.component.scss']
})
export class AffectationComponent implements OnInit {


  public itemForm: UntypedFormGroup;
  showMotif = false;
  employees: Employee[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AffectationComponent>,
    private fb: UntypedFormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private equipmentService : EquipmentService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) {  console.log(data.payload); }

  ngOnInit() {
    this.loadEmployes();
    this.buildItemForm(this.data.payload)
    
  }
  buildItemForm(item) {
    this.itemForm = this.fb.group({
      employeeNum: [item.employeeNum || '', Validators.required],
      equipmentNum : this.data.payload,
      endDate: [item.endDate || '', Validators.required],
      startDate: [item.startDate || '', Validators.required]
 })
  }


  /*************************************************  Api pour récupérer la liste des employées ************************************************/
  loadEmployes() {
    this.equipmentService.getResources().subscribe((data: Employee[]) => {
      this.employees = data;
      console.log("Employees data", data);
    });
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  } 
  
  
  submit() {
    this.dialogRef.close(this.itemForm.value)
  }

}
