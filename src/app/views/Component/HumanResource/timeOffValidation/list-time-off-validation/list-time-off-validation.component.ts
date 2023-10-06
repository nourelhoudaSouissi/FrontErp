import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Observable, Subscription } from 'rxjs';


import { RequestStatus, TimeOff } from 'app/shared/models/timeOff';
import { TimeOffValidationService } from '../time-off-validation.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { DatePipe } from '@angular/common';
import { LeaveType } from 'app/shared/models/leaveType';

@Component({
  selector: 'app-list-time-off-validation',
  templateUrl: './list-time-off-validation.component.html',
  styleUrls: ['./list-time-off-validation.component.scss']
})
export class ListTimeOffValidationComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  public dataSource:MatTableDataSource<TimeOff>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  requestStatus :any= Object.values(RequestStatus);
  //private datePipe: DatePipe;
  pendingCount : any;
  validatedCount : any;
  rejectedCount : any;
  timeOffDifference?: string;

  constructor(

    private dialog: MatDialog,
    private snack: MatSnackBar,
    private timeOffValidationService: TimeOffValidationService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) {     
    this.dataSource = new MatTableDataSource<TimeOff>([]);
  }


  
  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems();
   this.getAllPendingCount();
   this.getAllRejectedCount();
   this.getAllValidatedCount();
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
    return ['employeeName','dates','leaveType','leaveTypeName', 'requestStatus', 'diffrence', 'requestInputDate','actions'];
  }
  
  getItems() {    
    this.getItemSub = this.timeOffValidationService.getItems()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })


  }
  

  getValidationAlertMessage(startDate: string, leaveTypeAlertNumberDays: number, requestStatus: string): { message: string, style: any } {
    const today = new Date();
    const start = new Date(startDate);
    const timeDiffBeforeStart = Math.abs(start.getTime() - today.getTime());
    const diffDaysBeforeStart = Math.ceil(timeDiffBeforeStart / (1000 * 3600 * 24));
    let message = '';
    let style: any = {};
  
    if (requestStatus === 'VALIDATED') {
      message = 'Déjà validé';
      style = {  'font-weight': 'bold' };
    } else if (requestStatus === 'PENDING' && diffDaysBeforeStart <= leaveTypeAlertNumberDays) {
      if (diffDaysBeforeStart === 0) {
        message = 'Date limite aujourd\'hui !';
      } else if (diffDaysBeforeStart === 1) {
        message = 'Date limite demain !';
      } else {
        message = `Date limite ${diffDaysBeforeStart} jours.`;
      }
      style = { color: 'red', 'font-weight': 'bold' };
    } else { 
      message = `--`;
    }
  
    return { message, style };
  }
  
  
/*************************** Apply filter global  **************************/
applyFilter(event :Event){
  const FilterValue = (event.target as HTMLInputElement).value ;
   this.dataSource.filter = FilterValue.trim().toLowerCase();

}

 // Assuming this function is inside the ListTimeOffValidationComponent class
 getDifferenceInDays(startDate: string, endDate: string, requestStatus: string): { message: string, style: any } {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  let message = '';
  let style: any = {};

  switch (requestStatus) {
    case 'PENDING':
      if (today > start) {
        message = 'Validation passée';
        style = {
          color: 'orange',
          'font-weight': 'bold',
        };
      } else {
        message = 'Validation en cours';
        style = {
          color: 'grey',
          'font-weight': 'bold',
        };
      }
      break;

    case 'VALIDATED':
      if (today < start) {
        const timeDiffBeforeStart = Math.abs(start.getTime() - today.getTime());
        const diffDaysBeforeStart = Math.ceil(timeDiffBeforeStart / (1000 * 3600 * 24));
        message = `Congé validé, il reste ${diffDaysBeforeStart} jours`;
        style = {
          color: 'green',
          'font-weight': 'bold',
        };
      } else if (today >= start && today <= end) {
        const timeDiffBetweenDates = Math.abs(end.getTime() - today.getTime());
        const diffDaysBetweenDates = Math.ceil(timeDiffBetweenDates / (1000 * 3600 * 24));
        message = `Employee en congé, il reste ${diffDaysBetweenDates} jours`;
        style = {
          color: 'green',
          'font-weight': 'bold',
        };
      } else {
        message = 'Congé terminé';
        style = {
          color: 'blue',
          'font-weight': 'bold',
        };
      }
      break;

    case 'REJECTED':
      message = 'Congé refusé';
      style = {
        color: 'red',
        'font-weight': 'bold',
      };
      break;

    default:
      message = 'Statut non géré';
      style = {
        color: 'gray',
        'font-weight': 'bold',
      };
      break;
  }

  return { message, style };
}

  


  // Function to get cell style based on conditions
  getDiffrenceCellStyle(timeOff: TimeOff): any {
    const currentDate = new Date();
    const timeOffStartDate = new Date(timeOff.startDate);
    const timeOffEndDate = new Date(timeOff.endDate);
  
    // Reset time components to midnight for comparison
    currentDate.setHours(0, 0, 0, 0);
    timeOffStartDate.setHours(0, 0, 0, 0);
    timeOffEndDate.setHours(0, 0, 0, 0);
  
    const isStartDateGreaterThanCurrentDate = timeOffStartDate.getTime() > currentDate.getTime();
    const isStartDateLessThanCurrentDate = timeOffStartDate.getTime() < currentDate.getTime();
  
    const isPendingRequest = timeOff.requestStatus === 'PENDING';
    const isValidatedRequest = timeOff.requestStatus === 'VALIDATED';
    const isEnConge = isStartDateLessThanCurrentDate && currentDate.getTime() <= timeOffEndDate.getTime();
  
    if (isStartDateGreaterThanCurrentDate && isPendingRequest) {
      return {
        'font-weight': 'bold',
      };
    }
  
    if (isEnConge) {
      return {
        color: 'green',
        'font-weight': 'bold',
      };
    }
  
    if (isStartDateLessThanCurrentDate && isValidatedRequest) {
      return {
        color: 'red',
        'font-weight': 'bold',
      };
    }
  
    return {};
  }
  
  
  /*getDiffrenceCellStyle(row: TimeOff): any {
    const currentDate = new Date();
    const timeOffStartDate = new Date(row.startDate);
    const differenceInDays = parseInt(this.getDifferenceInDays(row.startDate, row), 10);
    const alertNumberDays = row.leaveTypeAlertNumberDays;
  
    if (timeOffStartDate > currentDate && row.requestStatus === 'PENDING') {
      return {
        'font-weight': 'bold',
      };
    } else if (timeOffStartDate < currentDate && row.requestStatus === 'VALIDATED') {
      return {
        color: 'purple',
        'font-weight': 'bold',
      };
    } else if (alertNumberDays !== undefined && differenceInDays <= alertNumberDays && row.requestStatus === 'PENDING') {
      return {
        color: 'orange',
        'font-weight': 'bold',
      };
    } else if (differenceInDays <= alertNumberDays && row.requestStatus === 'PENDING') {
      return {
        color: 'red',
        'font-weight': 'bold',
      };
    }
  
    return {};
  }*/
  /*getDifferenceInDays(startDate: Date, timeOff: TimeOff): string {
    const timeOffStartDate = new Date(startDate);
    const currentDate = new Date();
    
    timeOffStartDate.setHours(0, 0, 0, 0); // Reset time to midnight
    currentDate.setHours(0, 0, 0, 0); // Reset time to midnight
    const differenceInTime = timeOffStartDate.getTime() - currentDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  
    if (differenceInDays === 0) {
      return "Aujourd'hui";
    } else if (timeOff?.leaveType?.alertNumberDays !== undefined && differenceInDays <= timeOff.leaveType.alertNumberDays) {
      return `Alert`; // Return "Alert" when the condition is met
    } else {
      return `Rest ${Math.ceil(differenceInDays)} jours`;
    }
  }*/
    
  
  
  




  getStatusColor(requestStatus: string): { color: string, displayText: string } {
    const STATUS_DATA = {
      VALIDATED: { color: 'primary', displayText: 'Validé' },
      REJECTED: { color: 'red', displayText: 'Refusé' },
      PENDING: { color: 'gray', displayText: 'En cours' }
    };
    return STATUS_DATA[requestStatus] || { color: 'gray', displayText: 'En Cours' };
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

changeOffereStatus(requestStatus: string, timeOffId: number): void {
    console.log('Changing offer status to:', requestStatus);
    let updateObservable: Observable<any>;
    switch (requestStatus) {
      case 'requestStatus.VALIDATED':
        this.confirmService.confirm({ message: 'Êtes-vous sûr de vouloir valider cette demande de congé ?' })
        .subscribe((res) => {
          if (res) {
            this.loader.open('Validation Congé');
            this.timeOffValidationService.updateStatusToValidatedById(timeOffId)
              .subscribe(
                (data: any) => {
                  this.dataSource = data;
                  this.loader.close();
                  this.snack.open('Congé validé!', 'OK', { duration: 4000 });
                  this.getItems();
                },
                (error) => {
                  console.error('Erreur changement de status:', error);
                }
              );
          }
        });

      // updateObservable = this.timeOffValidationService.updateStatusToValidatedById(timeOffId);
      //  this.getItems();
        break;
      case 'requestStatus.REJECTED':
        this.confirmService.confirm({ message: 'Êtes-vous sûr de vouloir refuser cette demande de congé ?' })
        .subscribe((res) => {
          if (res) {
            this.loader.open('Validation Congé');
            this.timeOffValidationService.updateStatusToRejectedById(timeOffId)
              .subscribe(
                (data: any) => {
                  this.dataSource = data;
                  this.loader.close();
                  this.snack.open('Congé  refusé!', 'OK', { duration: 4000 });
                  this.getItems();
                },
                (error) => {
                  console.error('Erreur changement de status:', error);
                }
              );
          }
        });
      //  updateObservable = this.timeOffValidationService.updateStatusToRejectedById(timeOffId);
      // this.getItems();
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


  
getAllPendingCount(): void {
  this.timeOffValidationService.getAllPending().subscribe(
    (response: any) => {
      this.pendingCount = response;
    },
    (error: any) => {
      console.error('Erreur :', error);
    }
  );
}
getAllValidatedCount(): void {
  this.timeOffValidationService.getAllValidated().subscribe(
    (response: any) => {
      this.validatedCount = response;
    },
    (error: any) => {
      console.error('Erreur :', error);
    }
  );
}
getAllRejectedCount(): void {
  this.timeOffValidationService.getAllRejected().subscribe(
    (response: any) => {
      this.rejectedCount = response;
    },
    (error: any) => {
      console.error('Erreur :', error);
    }
  );
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


}
