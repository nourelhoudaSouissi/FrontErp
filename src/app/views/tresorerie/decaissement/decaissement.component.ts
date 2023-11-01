import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Disbursement } from 'app/shared/models/Disbursement.model';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { TresorerieService } from '../tresorerie.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DecaissementPopUpComponent } from './decaissement-pop-up/decaissement-pop-up.component';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-decaissement',
  templateUrl: './decaissement.component.html',
  styleUrls: ['./decaissement.component.scss']
})
export class DecaissementComponent implements OnInit {

  displayedColumns: string[] = [ 'category', 'description', 'totalWithDiscount', 'date', 'invoiceNumber', 'treasuryType', 'action'];
  dataSource = new MatTableDataSource<Disbursement>([]);
  disbursementList: Disbursement[];
  showEditOption = false;
  editedDisbursement: Disbursement;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 itemsToDisplay: any;
 disbursements: any;
 filteredDisbursements: Disbursement[] = [];
 
 

  constructor(private tresorerieService: TresorerieService,
   private confirmService: AppConfirmService,
   private cdr: ChangeDetectorRef,
   private dialog: MatDialog,
   private loader: AppLoaderService,
   private snack: MatSnackBar,



   ) {}



  getDisbursementList() {
   this.tresorerieService.getDisbursementList().subscribe((res: Disbursement[]) => {
     this.disbursementList = res;
     this.filteredDisbursements = this.disbursementList;
     this.dataSource = new MatTableDataSource(this.filteredDisbursements);
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
   });
 }
  buildDisbursementForm(disbursement: Disbursement) {
    this.showEditOption = true;
    this.editedDisbursement = disbursement;
  }

  deleteInvoiceById(id) {
   this.confirmService
     .confirm({
       title: "Confirm",
       message: "Voulez-vous supprimer cette encaissement?",
     })
     .subscribe((result) => {
       if (result === true) {
         this.tresorerieService.deleteDisbursement(id).subscribe((res) => {
           this.disbursementList = this.disbursementList.filter(
             (invoice) => invoice.id !== id
           );
           this.getDisbursementList();
           this.cdr.detectChanges();
         });
       }
     });
 }

 handlePageChange(event: any) {
   const startIndex = event.pageIndex * event.pageSize;
   const endIndex = startIndex + event.pageSize;
   this.itemsToDisplay = this.disbursements.slice(startIndex, endIndex);
   this.dataSource = new MatTableDataSource<Disbursement>(this.itemsToDisplay);
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
 }
 beneficiaryFilter='';
 categoryFilter='';
 amountFilter=null; // use null instead of 0

 ngOnInit() {
  this.getDisbursementList();
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 2000; year--) {
    this.years.push(year);
  }
  this.months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
  ];
  this.selectedYear = currentYear; // Display elements of the current year by default
  this.filterDisbursement();
}
treasuryTypeFilter: string = ''; 
descriptionFilter : string = '' ;

filterDisbursement() {
  let temp: Disbursement[] = this.disbursementList;
  if (this.selectedMonth && this.selectedYear) {
    temp = temp.filter((disbursement) => {
      const disbursementDate = new Date(disbursement.date);
      return (
        disbursementDate.getFullYear() === this.selectedYear &&
        disbursementDate.getMonth() === this.months.findIndex(m => m === this.selectedMonth)
      );
    });
  } else if (this.selectedYear) {
    temp = temp.filter((disbursement) => {
      const disbursementDate = new Date(disbursement.date);
      return (
        disbursementDate.getFullYear() === this.selectedYear
      );
    });
  }
  
// Filtre
if (this.categoryFilter) {
  temp = temp.filter((disbursement) =>
    disbursement.category === this.categoryFilter
  );
}
  
  if (this.beneficiaryFilter) {
    temp = temp.filter((disbursement) =>
      disbursement.bill.invoiceNumber.toLowerCase().includes(this.beneficiaryFilter.toLowerCase())
    );
  }
  if (this.descriptionFilter) {
    temp = temp.filter((disbursement) =>
      disbursement.description.toLowerCase().includes(this.descriptionFilter.toLowerCase())
    );
  }
  if (this.amountFilter !== null) {
    temp = temp.filter((disbursement) => disbursement.bill.totalWithDiscount === this.amountFilter);
  }

  if (this.treasuryTypeFilter) {
    temp = temp.filter((disbursement) =>
      disbursement.treasuryType === this.treasuryTypeFilter
    );
  }
  
  this.filteredDisbursements = temp;
  this.dataSource = new MatTableDataSource(this.filteredDisbursements);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}


selectedYear: number;
selectedMonth: string;
years: number[] = [];
months: string[] = [];

showAllMonths: boolean = false;

filterByMonth(month: string) {
  this.selectedMonth = month;
  this.showAllMonths = false;
  this.filterDisbursement();
}    

filterByYear(year: number) {
  // Filter data by year
  const filteredData = this.disbursementList.filter((item) => {
    return new Date(item.date).getFullYear() === year;
  });

  // Assign the filtered data to the table data source
  this.dataSource = new MatTableDataSource(filteredData);

  // Update the paginator length and reset to first page
  this.paginator.length = filteredData.length;
  this.paginator.firstPage();
}


getTotal(): number {
  return this.dataSource.filteredData.reduce((acc, curr) => acc + curr.bill.totalWithDiscount, 0);
}


openPopUp(data: any, isNew?) {
  let title = isNew ? 'Ajouter nouveau decaissement' : 'modifier decaissement';
  let dialogRef: MatDialogRef<any> = this.dialog.open(DecaissementPopUpComponent, {
    width: '50%',
    disableClose: true,
    data: { title: title, payload: data }
  });

  dialogRef.afterClosed().subscribe(res => {
    if (!res) {
      // If user presses cancel
      return;
    }

    if (isNew) {
      this.loader.open('Ajouter nouveau decaissement');
      if (this.validateForm(res)) {
        this.tresorerieService.saveDisbursement(res)
          .subscribe((data: any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Decaissement ajouté!', 'OK', { duration: 2000 });
            this.getDisbursementList();
          }, error => {
            this.loader.close();
            this.snack.open('Erreur lors de la sauvegarde du decaissement.', 'OK', { duration: 2000 });
            console.error('Error saving disbursement:', error);
          });
      } else {
        // Form validation failed, handle error
        // For example, show an error message to the user
        this.loader.close();
        this.snack.open('Veuillez remplir tous les champs obligatoires.', 'OK', { duration: 2000 });
      }
    } else {
      this.loader.open('Modifier decaissement');
      if (this.validateForm(res)) {
        this.tresorerieService.updateDisbursement(data.id, res)
          .subscribe((data: any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Decaissement modifié!', 'OK', { duration: 2000 });
            this.getDisbursementList();
          }, error => {
            this.loader.close();
            this.snack.open('Erreur lors de la mise à jour du decaissement.', 'OK', { duration: 2000 });
            console.error('Error updating disbursement:', error);
          });
      } else {
        // Form validation failed, handle error
        // For example, show an error message to the user
        this.loader.close();
        this.snack.open('Veuillez remplir tous les champs obligatoires.', 'OK', { duration: 2000 });
      }
    }
  });
}

validateForm(formValue: any): boolean {
  if (
    formValue.category &&
    formValue.billId &&
    formValue.date &&
    formValue.description
  ) {
    return true;
  } else {
    return false;
  }
}



}

