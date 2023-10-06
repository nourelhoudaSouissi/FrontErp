import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TimeOff } from 'app/shared/models/timeOff';
import { Subscription } from 'rxjs';
import { TimeOffService } from '../time-off.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CreateTimeOffComponent } from '../create-time-off/create-time-off.component';


@Component({
  selector: 'app-list-time-off',
  templateUrl: './list-time-off.component.html',
  styleUrls: ['./list-time-off.component.scss']
})
export class ListTimeOffComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  public dataSource:MatTableDataSource<TimeOff>;
  public displayedColumns: any;
  public getItemSub: Subscription;
 

  constructor(
    
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private timeOffService: TimeOffService ,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) {     this.dataSource = new MatTableDataSource<TimeOff>([]);}


  
  ngOnInit() {
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
    return ['employeeName','dates','leaveTypeName', 'leaveType', 'requestStatus', 'requestInputDate', 'actions'];
  }

  /*formatDate(date: Date): string {
    moment.locale('fr');
    const momentDate = moment(date).tz('Africa/Tunis');
    return momentDate.format('ll');
  }**/

  getItems() {    
    this.getItemSub = this.timeOffService.getItems()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }

  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Ajouter Congé ' : 'Mettre à jour Congé';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CreateTimeOffComponent, {
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
          this.loader.open('Ajout Congé en cours');
          this.timeOffService.addItem(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Congé ajouté avec succès !', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
          this.loader.open('Mise à jour besoin');
          this.timeOffService.updateItem(data.id, res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Congé mis à jour !', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  deleteItem(row) {
    
    this.confirmService.confirm({message: `Delete ${row.firstName} ${row.lastName}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('supprimer Congé ');
          this.timeOffService.deleteItem(row.id)
          .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Congé supprimée!', 'OK', { duration: 4000 })
              this.getItems();
            })
        }
      })
  }

  getStatusColor(requestStatus: string): { color: string, displayText: string } {
    const REQUEST_STATUS_DATA = {
      
      VALIDATED: { color: 'blue', displayText: 'Validé' },
      REJECTED: { color: 'red', displayText: 'Refusé' },
      PENDING: { color: 'gray', displayText: 'En Cours' }
    
    };
    return REQUEST_STATUS_DATA[requestStatus];
  }

  getLeaveType(timeOffType: string): { displayText: string } {
    const TIME_OFF_DATA = {
      
      PAID_LEAVE: {  displayText: 'Payé' },
      SPECIAL_PAID_LEAVE: { displayText: 'Spécial payé' },
      UNPAIED_TIME_OFF: { displayText: 'Sans Solde' },
      SICKNESS_LEAVE: { displayText: 'Maladie' },
      OTHER: { displayText: 'Autre' }
    
    };
    return TIME_OFF_DATA[timeOffType];
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

  
/*************************** Apply filter global  **************************/
applyFilter(event :Event){
  const FilterValue = (event.target as HTMLInputElement).value ;
   this.dataSource.filter = FilterValue.trim().toLowerCase();

}
}
