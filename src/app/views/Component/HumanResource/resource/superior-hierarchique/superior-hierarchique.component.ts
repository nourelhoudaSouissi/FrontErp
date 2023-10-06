import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResourceService } from '../resource.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Employee } from 'app/shared/models/Employee';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-superior-hierarchique',
  templateUrl: './superior-hierarchique.component.html',
  styleUrls: ['./superior-hierarchique.component.scss']
})
export class SuperiorHierarchiqueComponent implements OnInit {
  public itemForm: UntypedFormGroup;
  employees: Employee[] = [];
  constructor(  
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SuperiorHierarchiqueComponent>,
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private resourceService: ResourceService ,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
  ) { }

  

   

  ngOnInit() {
    this.buildItemForm(this.data.payload)
    this.loadEmployes();  
  }

  loadEmployes() {
    this.resourceService.getSuperior().subscribe((data: Employee[]) => {
      this.employees = data;
      console.log("Employees data", data);
    });
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      hierarchicalSuperiorNum: [item.hierarchicalSuperiorNum || '', Validators.required]
   })
  }



 
  
  
  submit() {
    this.dialogRef.close(this.itemForm.value)
    }
  

  }
