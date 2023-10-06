import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExpenseReport } from 'app/shared/models/expenseReport';
import { Subscription } from 'rxjs';
import { ExpenseReportService } from '../expense-report.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CreateExpenseReportComponent } from '../create-expense-report/create-expense-report.component';

@Component({
  selector: 'app-list-expense-report',
  templateUrl: './list-expense-report.component.html',
  styleUrls: ['./list-expense-report.component.scss']
})
export class ListExpenseReportComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  public dataSource:MatTableDataSource<ExpenseReport>;
  public displayedColumns: any;
  public getItemSub: Subscription;
 
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private expenseReportService: ExpenseReportService ,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) { 
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
    return ['feeType','billingDate','price','customerBilling', 'requestStatus', 'createDate', 'actions'];
  }

  getItems() {    
    this.getItemSub = this.expenseReportService.getItems()
      .subscribe((data:any)  => {
        data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }

  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Ajouter Note de Frais ' : 'Mettre à jour Note de Frais';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CreateExpenseReportComponent, {
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
          this.loader.open('Ajout Note de Frais en cours');
          this.expenseReportService.addItem(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Note de Frais ajouté avec succès !', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
          this.loader.open('Mise à jour Note de Frais');
          this.expenseReportService.updateItem(data.id, res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Note de Frais mis à jour !', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  deleteItem(row) {
    
    this.confirmService.confirm({message: `Delete ${row.firstName} ${row.lastName}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('supprimer Note de Frais ');
          this.expenseReportService.deleteItem(row.id)
          .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Note de Frais supprimée!', 'OK', { duration: 4000 })
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

/*************************** Apply filter global  **************************/
applyFilter(event :Event){
  const FilterValue = (event.target as HTMLInputElement).value ;
   this.dataSource.filter = FilterValue.trim().toLowerCase();

}

}



