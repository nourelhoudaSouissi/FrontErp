import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExpenseReport } from 'app/shared/models/expenseReport';
import { Observable, Subscription } from 'rxjs';
import { ExpenseReportValidationService } from '../expense-report-validation.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-list-expense-report-validation',
  templateUrl: './list-expense-report-validation.component.html',
  styleUrls: ['./list-expense-report-validation.component.scss']
})
export class ListExpenseReportValidationComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  public dataSource:MatTableDataSource<ExpenseReport>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  constructor( private dialog: MatDialog,
    private snack: MatSnackBar,
    private expenseReportValidationService: ExpenseReportValidationService ,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService) {
      this.dataSource = new MatTableDataSource<ExpenseReport>([]);
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
    return ['employeeName','billingDate','feeType','price','customerBilling', 'requestStatus', 'createDate', 'actions'];
  }

  getItems() {    
    this.getItemSub = this.expenseReportValidationService.getItems()
      .subscribe((data:any)  => {
        data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }

  
  getStatusColor(requestStatus: string): { color: string, displayText: string } {
    const REQUEST_STATUS_DATA = {
      
      VALIDATED: { color: 'purple', displayText: 'Validé' },
      REJECTED: { color: 'red', displayText: 'Refusé' },
      PENDING: { color: 'gray', displayText: 'En Cours' }
    
    };
    return REQUEST_STATUS_DATA[requestStatus];
  }



  getFeeType(feeType: string): { displayText: string } {
    const FEE_TYPE_DATA = {
      
      TRANSPORT: {  displayText: 'Transport' },
      ACCOMODATION: { displayText: 'Ebergement/ Hotél' },
      FUEL: { displayText: 'Carburant' },
      MEALS: { displayText: 'Repas ' },
      PHONE: { displayText: 'Téléphone et Communication' },
      LEISURE: { displayText: 'Loisir' },
      CLIENT_INVITATION: { displayText: 'Invitation Client' },
      OTHER: { displayText: 'Autre' }
    
    };
    return FEE_TYPE_DATA[feeType];
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


  changeOffereStatus(requestStatus: string, timeOffId: number): void {
    console.log('Changing offer status to:', requestStatus);
    let updateObservable: Observable<any>;
    switch (requestStatus) {
      case 'requestStatus.VALIDATED':
        this.confirmService.confirm({ message: 'Êtes-vous sûr de vouloir valider cette Note de Frais ?' })
        .subscribe((res) => {
          if (res) {
            this.loader.open('Validation  Note de Frais');
            this.expenseReportValidationService.updateStatusToValidatedById(timeOffId)
              .subscribe(
                (data: any) => {
                  this.dataSource = data;
                  this.loader.close();
                  this.snack.open(' Note de Frais validé!', 'OK', { duration: 4000 });
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
        this.confirmService.confirm({ message: 'Êtes-vous sûr de vouloir refuser cette Note de Frais ?' })
        .subscribe((res) => {
          if (res) {
            this.loader.open('Refus Note de Frais');
            this.expenseReportValidationService.updateStatusToRejectedById(timeOffId)
              .subscribe(
                (data: any) => {
                  this.dataSource = data;
                  this.loader.close();
                  this.snack.open('Note de Frais refusée!', 'OK', { duration: 4000 });
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


}
