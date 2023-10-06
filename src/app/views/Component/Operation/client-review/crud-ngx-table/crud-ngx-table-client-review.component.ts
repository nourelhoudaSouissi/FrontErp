import { NgxTablePopupComponent } from './../../../../cruds/crud-ngx-table/ngx-table-popup/ngx-table-popup.component';
import { clientReviewService } from './../../../../../shared/services/auth/webApi/projectApi/clientReview.service';
import { clientReview } from 'app/shared/models/clientReview.model';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from './../../../../../shared/services/app-loader/app-loader.service';
import { NgxClientReviewTablePopupComponent } from './ngx-table-popup/ngx-table-popup-client-review.component';
import { CrudClientReviewService } from './../crudClientReview.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-crud-ngx-table',
  templateUrl: './crud-ngx-table-client-review.component.html',
  animations: egretAnimations
})

export class CrudClientReviewNgxTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  public dataSource:  MatTableDataSource<clientReview>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private clientReviewService: clientReviewService,
    private crudClientReviewService: CrudClientReviewService,
    private AppConfirmService: AppConfirmService,
    private loader: AppLoaderService
  ) { }

  ngOnInit(): void {
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
    return ['id','dateReview', 'subject', 'comment', 'satisfaction','reviewtype', 'actions'];
  }

 /*getItems() {    
    this.getItemSub = this.clientReviewService.getClientReviewsList()
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource(data);
      })
  }*/

  getItems() {    
    this.getItemSub = this.clientReviewService.getClientReviewsList()
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource<clientReview>([]);
        this.dataSource.data = data;
      });
  }
  
  openPopUp(data:  clientReview[] , isNew?) {
    let title = isNew ? 'Add new Client Review' : 'Update Client Review';
    let dialogRef: MatDialogRef<any> = this.dialog.open(NgxClientReviewTablePopupComponent, {
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
          this.loader.open('Adding new Client Review');
          this.crudClientReviewService.addItem(res)
            .subscribe((data:any) => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Client Review Added!', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
          this.loader.open('Updating Client Review');
          this.crudClientReviewService.updateItem(res.id,res)
            .subscribe((data:any) => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Client Review Updated!', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }
 /* openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Add new Client Review' : 'Update Client Review';
    let dialogRef: MatDialogRef<any> = this.dialog.open(NgxClientReviewTablePopupComponent, {
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
          this.loader.open('Adding new Client Review');
          console.log("res"+ JSON.stringify(res))
          this.crudClientReviewService.addItem(res)
           .subscribe(data=> {
              this.dataSource = new MatTableDataSource<clientReview>([data]);
              console.log("data"+ JSON.stringify(res))
              this.loader.close();
              this.snack.open('Client Review Added!', 'OK', { duration: 4000 })
            
            })
            
            /*.subscribe(data => {
              const newClientReview = data[0];
              this.dataSource = new MatTableDataSource<clientReview>([newClientReview]);
              this.loader.close();
              this.snack.open('Client Review Added!', 'OK', { duration: 4000 })
            })*/
          /*} else {
          this.loader.open('Updating Client Review');
          this.clientReviewService.updateClientReview(data.id, res)
            .subscribe(data => {
              this.dataSource = new MatTableDataSource<clientReview>([data]);
              this.loader.close();
              this.snack.open('Client Review Updated!', 'OK', { duration: 4000 })
            })
        }
      })
  }*/
 
  deleteItem(row) {
    this.AppConfirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Deleting Partner');
          this.crudClientReviewService.deleteItem(row)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Partner deleted!', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  getStatusColor(reviewType: string): { color: string, displayText: string } {
    const REVIEW_TYPE_DATA = {
      POSITIVE: { color: 'green', displayText: 'Positive' },
      NEUTRAL: { color: 'blue', displayText: 'Neutral' },
      NEGATIVE: { color: 'red', displayText: 'Negative' },
      CRITICAL: { color: 'purple', displayText: 'Critical' },
      VERIFIED: { color: 'green', displayText: 'Verified' },
      UNVERIFIED: { color: 'gray', displayText: 'Unverified' },
      FEATURE_REQUEST: { color: 'orange', displayText: 'Feature Request' },
      BUG_REPORT: { color: 'red', displayText: 'Bug Report' },
      QUESTION: { color: 'blue', displayText: 'Question' },
      COMPLIMENT: { color: 'yellow', displayText: 'Compliment' }
    };
    
    return REVIEW_TYPE_DATA[reviewType];
  }
 
}