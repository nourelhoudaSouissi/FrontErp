import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveType } from 'app/shared/models/leaveType';
import { Subscription } from 'rxjs';
import { LeaveTypeService } from '../leave-type.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CreateLeaveTypeComponent } from '../create-leave-type/create-leave-type.component';
import { ViewLeaveTypeComponent } from '../view-leave-type/view-leave-type.component';

@Component({
  selector: 'app-list-leave-type',
  templateUrl: './list-leave-type.component.html',
  styleUrls: ['./list-leave-type.component.scss']
})
export class ListLeaveTypeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource:MatTableDataSource<LeaveType>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  constructor( 
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private leaveTypeService: LeaveTypeService ,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService) { 
      this.dataSource = new MatTableDataSource<LeaveType>([]);
    }
  ngOnInit(): void {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems();
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
    return ['name', 'description', 'duration','alertNumberDays', 'timeOffType', 'actions'];
  }
  getItems() {    
    this.getItemSub = this.leaveTypeService.getItems()
      .subscribe((data:any)  => {
        data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }


  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Ajouter Type de congé' : 'Modifier le Type de congé';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CreateLeaveTypeComponent, {
      width: '900px',
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
          this.loader.open('Ajout Type de congé en cours');
          this.leaveTypeService.addItem(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Type de congé ajouté avec succés !', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
          this.loader.open('Modifer le Type de congé');
          this.leaveTypeService.updateItem(data.id, res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Type de congé modifié avec succés !', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  deleteItem(row) {
    
    this.confirmService.confirm({message: `Etes vous sur de la  suppression?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('supprimer type de congé ');
          this.leaveTypeService.deleteItem(row.id)
          .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Type de congé supprimé!', 'OK', { duration: 4000 })
              this.getItems();
            })
        }
      })
  }


  applyFilterr(event: Event, key: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.filterPredicate = (data, filter) => {
      return data[key].trim().toLowerCase().indexOf(filter) !== -1;
    };
  }

 
  openPopUpView(row: any): void {
    const dialogRef = this.dialog.open(ViewLeaveTypeComponent, {
      width: '600px',
      data:  { leaveType : row},
    });
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog opened successfully.');
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      // Code executed after the dialog is closed
    }, error => {
      console.error('An error occurred while opening the dialog:', error);
      // Handle the error appropriately (e.g., display an error message)
    });
  }




getTimeOffType(timeOffType: string): { displayText: string } {
  const TIME_OFF_TYPE_DATA = {  
    PAID_LEAVE: {  displayText: 'Congé payé' },
    SPECIAL_PAID_LEAVE: { displayText: 'Congé spécial payé' },
    UNPAIED_TIME_OFF: { displayText: 'Congé sans solde' },
    SICKNESS_LEAVE: { displayText: 'Congé de maladie' },
    OTHER: { displayText: 'Autre' }
  };
  return TIME_OFF_TYPE_DATA[timeOffType];
}


/*************************** Apply filter global  **************************/
applyFilter(event :Event){
  const FilterValue = (event.target as HTMLInputElement).value ;
   this.dataSource.filter = FilterValue.trim().toLowerCase();

}
}
