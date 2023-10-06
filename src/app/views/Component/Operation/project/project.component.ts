import { CrudProjectService } from './crudProject.service';
import { NgxTablePopupComponent } from './ngx-table-popup/ngx-table-popup.component';

import { MatTableDataSource } from '@angular/material/table';
import { AppLoaderService } from './../../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from './../../../../shared/services/app-confirm/app-confirm.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  public dataSource: any;
  public displayedColumns: any;
  public getItemSub: Subscription;
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudProjectService: CrudProjectService,
    private confirmService: AppConfirmService,
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
    return ['name', 'age', 'balance', 'company', 'status', 'actions'];
  }

  getItems() {    
    this.getItemSub = this.crudProjectService.getItems()
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
      })
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Add new Project' : 'Update Project';
    let dialogRef: MatDialogRef<any> = this.dialog.open(NgxTablePopupComponent, {
      width: '720px',
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
          this.loader.open('Adding new Project');
          this.crudProjectService.addItem(res)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Project Added!', 'OK', { duration: 4000 })
            })
        } else {
          this.loader.open('Updating Project');
          this.crudProjectService.updateItem(data._id, res)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Project Updated!', 'OK', { duration: 4000 })
            })
        }
      })
  }
  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Deleting Project');
          this.crudProjectService.removeItem(row)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Project deleted!', 'OK', { duration: 4000 })
            })
        }
      })
  }
}
