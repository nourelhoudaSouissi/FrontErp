import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RecoveryLeave, RequestStatus } from 'app/shared/models/recoveryLeave';
import { Subscription } from 'rxjs';
import { RecoveryValidationService } from '../recovery-validation.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Observable } from 'rxjs-compat';
import { DatePipe } from '@angular/common';
import { ViewRecoveryValidationComponent } from '../view-recovery-validation/view-recovery-validation.component';

@Component({
  selector: 'app-list-recovery-validation',
  templateUrl: './list-recovery-validation.component.html',
  styleUrls: ['./list-recovery-validation.component.scss']
})
export class ListRecoveryValidationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource:MatTableDataSource<RecoveryLeave>;
  public displayedColumns: any;
  public getItemSub: Subscription;

  requestStatus :any= Object.values(RequestStatus);
  private datePipe: DatePipe
  validatedCount:number;
  rejectedCount:number;
  pendingCount:number;

  constructor( 
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private recoveryValidationService: RecoveryValidationService ,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService) { 
      this.dataSource = new MatTableDataSource<RecoveryLeave>([]);
    }

  ngOnInit(): void {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems();
    this.getAllPending();
    this.getAllRejected();
    this.getAllValidated();
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
    return ['employeeName','name', 'recoveryType', 'recoveryDay',  'inputDate', 'requestStatus', 'actions'];
  }
  getItems() {    
    this.getItemSub = this.recoveryValidationService.getItems()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
    const STATUS_DATA = {
      VALIDATED: { color: 'primary', displayText: 'Validé' },
      REJECTED: { color: 'red', displayText: 'Refusé' },
      PENDING: { color: 'gray', displayText: 'En cours' }
    };
    return STATUS_DATA[requestStatus] || { color: 'gray', displayText: 'En Cours' };
  }

  changeOffereStatus(requestStatus: string, recoveryId: number): void {
    console.log('Changing offer status to:', requestStatus);
    let updateObservable: Observable<any>;
    switch (requestStatus) {
      case 'requestStatus.VALIDATED':
        updateObservable = this.recoveryValidationService.updateStatusToValidatedById(recoveryId);
        this.getItems();
        break;
      case 'requestStatus.REJECTED':
        updateObservable = this.recoveryValidationService.updateStatusToRejectedById(recoveryId);
        this.getItems();
        break;
      
      default:
        // Cas de statut de contrat non géré
        console.error('Statut de l recupération non géré');
        return;
    }
    updateObservable.subscribe(
      (data) => {
        // handle success
        console.log('Mise à jour effectuée avec succès');
        this.getItems();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour : ', error);
      }
    );
  }
  

 

  openPopUpView(row: any): void {
    const dialogRef = this.dialog.open(ViewRecoveryValidationComponent, {
      width: '700px',
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

  getAllValidated(): void {
    this.recoveryValidationService.getAllValidated().subscribe(
      (response: any) => {
        this.validatedCount = response;
      },
      (error: any) => {
        console.error('Erreur :', error);
      }
    );
  }
 
  
  getAllRejected(): void {
    this.recoveryValidationService.getAllRejected().subscribe(
      (response: any) => {
        this.rejectedCount = response;
      },
      (error: any) => {
        console.error('Erreur :', error);
      }
    );
  }
  
  getAllPending(): void {
    this.recoveryValidationService.getAllPending().subscribe(
      (response: any) => {
        this.pendingCount = response;
      },
      (error: any) => {
        console.error('Erreur :', error);
      }
    );
  }

}
