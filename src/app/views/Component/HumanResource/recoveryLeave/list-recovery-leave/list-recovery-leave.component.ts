import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RecoveryLeave } from 'app/shared/models/recoveryLeave';
import { Subscription } from 'rxjs';
import { RecoveryLeaveService } from '../recovery-leave.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CreateRecoveryLeaveComponent } from '../create-recovery-leave/create-recovery-leave.component';
import { ViewRecoveryLeaceComponent } from '../view-recovery-leace/view-recovery-leace.component';

@Component({
  selector: 'app-list-recovery-leave',
  templateUrl: './list-recovery-leave.component.html',
  styleUrls: ['./list-recovery-leave.component.scss']
})
export class ListRecoveryLeaveComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource:MatTableDataSource<RecoveryLeave>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  constructor( 
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private recoveryLeaveService: RecoveryLeaveService ,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService) { 
      this.dataSource = new MatTableDataSource<RecoveryLeave>([]);
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
    return ['name', 'recoveryType', 'recoveryDay',  'inputDate', 'requestStatus', 'actions'];
  }
  getItems() {    
    this.getItemSub = this.recoveryLeaveService.getItems()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }


  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Ajouter Récupération' : 'Mettre à jour Récupération';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CreateRecoveryLeaveComponent, {
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
          this.loader.open('Ajout Récupération en cours');
          this.recoveryLeaveService.addItem(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Récupération ajouté avec succès !', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
          this.loader.open('Mise à jour Récupération');
          this.recoveryLeaveService.updateItem(data.id, res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Récupération mis à jour !', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  deleteItem(row) {
    
    this.confirmService.confirm({message: `Delete ${row.firstName} ${row.lastName}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('supprimer Récupération ');
          this.recoveryLeaveService.deleteItem(row.id)
          .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Récupération supprimée!', 'OK', { duration: 4000 })
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
    const dialogRef = this.dialog.open(ViewRecoveryLeaceComponent, {
      width: '700px',
      height:'800px',
      data:  { recoveryLeave : row},
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



  getRecoveryDay(recoveryDay: string): { displayText: string } {
    const RECOVERY_DAY_DATA = {
      
      HOLIDAY: {  displayText: 'Jour férié' },
      WEEKEND: { displayText: 'Weekend' },
      OVERTIME: { displayText: 'Heure supplémentaire' }
         
    };
    return RECOVERY_DAY_DATA[recoveryDay];
  }

  getRecoveryType(recoveryType: string): { displayText: string } {
    const RECOVERY_TYPE_DATA = {
      
      DAYS: {  displayText: 'Jour de congé' },
      MONEY: { displayText: 'Compensation' }
         
    }; 
    return RECOVERY_TYPE_DATA[recoveryType];
  }


  getStatusColor(requestStatus: string): { color: string, displayText: string } {
    const REQUEST_STATUS_DATA = {
      
      VALIDATED: { color: 'blue', displayText: 'Validé' },
      REJECTED: { color: 'red', displayText: 'Refusé' },
      PENDING: { color: 'gray', displayText: 'En Cours' }
    
    };
    return REQUEST_STATUS_DATA[requestStatus];
  }

  /*************************** Apply filter global  **************************/
  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }
}
