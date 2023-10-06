import { PopupCreateTimeOffComponent } from './ngx-table-popup/popup-createTimeOff.component';
import { CrudTimeOffService } from './../timeOff.service';
import { egretAnimations } from '../../../../../shared/animations/egret-animations';
import { AppLoaderService } from '../../../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from '../../../../../shared/services/app-confirm/app-confirm.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-crud-ngx-table',
  templateUrl: './crudTimeOff-table.component.html',
  animations: egretAnimations
})
export class CrudTimeOffTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  public dataSource: any;
  public displayedColumns: any;
  public getItemSub: Subscription;
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudTimeOffService: CrudTimeOffService,
    private AppConfirmService: AppConfirmService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }

  getDisplayedColumns() {
    return ['typeAbs', 'nbJours', 'dateDeb', 'dateFin', 'approuve','status', 'actions'];
  }

  getItems() {    
    this.getItemSub = this.crudTimeOffService.getItems()
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      })
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Ajouter une absence' : 'Modifier absence';
    let dialogRef: MatDialogRef<any> = this.dialog.open(PopupCreateTimeOffComponent, {
      width: '1000px',
      disableClose: true,

      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        if (isNew) {
          this.loader.open('Ajouter Absence');
          this.crudTimeOffService.addItem(res)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Absence Ajoutée!', 'OK', { duration: 4000 })
            })
        } else {
          this.loader.open('Modifier Absence');
          this.crudTimeOffService.updateItem(data._id, res)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Absence Modifiée!', 'OK', { duration: 4000 })
            })
        }
      })
  }
  deleteItem(row) {
    this.AppConfirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Supprimer Absence');
          this.crudTimeOffService.removeItem(row)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Absence Supprimée!', 'OK', { duration: 4000 })
            })
        }
      })
  }

}