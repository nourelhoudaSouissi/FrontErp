
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service'; 
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service'; 
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReqService } from '../../req.service';
import { req } from 'app/shared/models/req';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { ReqpopComponent } from '../../req-pop/reqpop/reqpop.component';
@Component({
  selector: 'app-reqlist',
  templateUrl: './reqlist.component.html',
  animations: egretAnimations
})
export class ReqlistComponent implements OnInit , OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  public dataSource: MatTableDataSource<req>;
  public displayedColumns: any;
  public getItemSub: Subscription;
 


  constructor(
    
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private ReqService: ReqService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) {     this.dataSource = new MatTableDataSource<req>([]);}

  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()
 

      
  }

  getDisplayedColumns() {
    return ['title','description','Criteria','plannedBudget','plannedIncome',
    'startDate','expectedEndDate','responseDate',
    'totalCandidateNumber','requirementType','requirementStatus','workField','availability','actions',
    ];
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

  getItems() {    
    this.getItemSub = this.ReqService.getItems()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }


  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Deleting Partner');
          this.ReqService.deleteItem(row)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Req deleted!', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }

 openPopUp(data:  any , isNew?) {
  let title = isNew ? 'Add new Req' : 'Update Req';
  let dialogRef: MatDialogRef<any> = this.dialog.open(ReqpopComponent, {
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
        this.loader.open('Adding new Req');
        this.ReqService.addItem(res)
          .subscribe((data :any)=> {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Req Added!', 'OK', { duration: 2000 });
            this.getItems();
            console.log(res)
          })
      } else {
        this.loader.open('Updating Req');
        this.ReqService.updateItem(data.id,res)
          .subscribe((data:any) => {
            this.dataSource = data ;
            this.loader.close();
            this.snack.open('Req Updated!', 'OK', { duration: 2000 });
            this.getItems();
            console.log(res)
          })
      }
    })
}
}