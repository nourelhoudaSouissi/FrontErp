import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Tresorerie } from 'app/shared/models/tresorerie.model';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { TresorerieService } from '../tresorerie.service';
import { EncaissementPopUpComponent } from './encaissement-pop-up/encaissement-pop-up.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Rapprochement } from 'app/shared/models/rapprochement.model';
import { PopUpRapprochementComponent } from 'app/views/rapprochement/pop-up-rapprochement/pop-up-rapprochement.component';
import { RapprochementService } from 'app/views/rapprochement/rapprochement.service';

@Component({
  selector: 'app-encaissement',
  templateUrl: './encaissement.component.html',
  styleUrls: ['./encaissement.component.scss']
})
export class EncaissementComponent implements OnInit {

  displayedColumns: string[] = [ 'category', 'client', 'amount', 'date', 'action'];
   dataSource = new MatTableDataSource<Tresorerie>([]);
   tresorerieList: Tresorerie[];
   showEditOption = false;
   editedTresorerie: Tresorerie;

   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
  itemsToDisplay: any;
  tresoreries: any;
  filteredTresoreries: Tresorerie[] = [];
  

   constructor(private tresorerieService: TresorerieService,
    private confirmService: AppConfirmService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private rapprochementService: RapprochementService,

    ) {}

  

   getTresorerieList() {
    this.tresorerieService.getCollectionList().subscribe((res: Tresorerie[]) => {
      this.tresorerieList = res;
      this.filteredTresoreries = this.tresorerieList;
      this.dataSource = new MatTableDataSource(this.filteredTresoreries);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
   buildTresorerieForm(tresorerie: Tresorerie) {
     this.showEditOption = true;
     this.editedTresorerie = tresorerie;
   }

   deleteInvoiceById(id) {
    this.confirmService
      .confirm({
        title: "Confirm",
        message: "Voulez-vous supprimer cette encaissement?",
      })
      .subscribe((result) => {
        if (result === true) {
          this.tresorerieService.deleteCollection(id).subscribe((res) => {
            this.tresorerieList = this.tresorerieList.filter(
              (invoice) => invoice.id !== id
            );
            this.getTresorerieList();
            this.cdr.detectChanges();
          });
        }
      });
  }

  handlePageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.itemsToDisplay = this.tresoreries.slice(startIndex, endIndex);
    this.dataSource = new MatTableDataSource<Tresorerie>(this.itemsToDisplay);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  clientFilter='';
  categoryFilter='';
  amountFilter=null; // use null instead of 0
  



  
  ngOnInit() {
    this.getTresorerieList();
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
    this.filterTresorerie();
  }
  
  descriptionFilter : '';
  treasuryTypeFilter: string = ''

  filterTresorerie() {
    let temp: Tresorerie[] = this.tresorerieList;
    if (this.selectedMonth && this.selectedYear) {
      temp = temp.filter((tresorerie) => {
        const tresorerieDate = new Date(tresorerie.date);
        return (
          tresorerieDate.getFullYear() === this.selectedYear &&
          this.months[tresorerieDate.getMonth()] === this.selectedMonth
        );
      });
    } else if (this.selectedYear) {
      temp = temp.filter((tresorerie) => {
        const tresorerieDate = new Date(tresorerie.date);
        return (
          tresorerieDate.getFullYear() === this.selectedYear
        );
      });
    }
    if (this.categoryFilter) {
      temp = temp.filter((tresorerie) =>
        tresorerie.category.toLowerCase().includes(this.categoryFilter.toLowerCase())
      );
    }
    if (this.descriptionFilter) {
      temp = temp.filter((disbursement) =>
        disbursement.description.toLowerCase().includes(this.descriptionFilter.toLowerCase())
      );
    }
    if (this.clientFilter) {
      temp = temp.filter((tresorerie) =>
        tresorerie.billClient.invoiceNumber.toLowerCase().includes(this.clientFilter.toLowerCase())
      );
    }
    if (this.amountFilter !== null) {
      temp = temp.filter((tresorerie) =>
        tresorerie.billClient.totalWithDiscount === this.amountFilter
      );
    }
    if (this.treasuryTypeFilter) {
      temp = temp.filter((disbursement) =>
        disbursement.treasuryType === this.treasuryTypeFilter
      );
    }
    this.filteredTresoreries = temp;
    this.dataSource = new MatTableDataSource(this.filteredTresoreries);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  
  filterByMonth(month: string) {
    this.selectedMonth = month;
    this.filterTresorerie();
  }
  
  selectedYear: number;
  selectedMonth: string;
  
  years: number[] = [];
  months: string[] = [];

  filterByYear(year: number) {
    // Filter data by year
    const filteredData = this.tresorerieList.filter((item) => {
      return new Date(item.date).getFullYear() === year;
    });
  
    // Assign the filtered data to the table data source
    this.dataSource = new MatTableDataSource(filteredData);
  
    // Update the paginator length and reset to first page
    this.paginator.length = filteredData.length;
    this.paginator.firstPage();
  }
  
  getTotal(): number {
    return this.dataSource.filteredData.reduce((acc, curr) => acc + curr.billClient.totalWithDiscount, 0);
  }

  openPopUp(data: any, isNew?) {
    let title = isNew ? 'Ajouter nouveau encaissement' : 'Modifier encaissement';
    let dialogRef: MatDialogRef<any> = this.dialog.open(EncaissementPopUpComponent, {
      width: '50%',
      disableClose: true,
      data: { title: title, payload: data }
    });
    
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user presses cancel
          return;
        }
        
        if (isNew) {
          this.loader.open('Ajouter nouveau encaissement');
          if (this.validateForm(res)) {
            this.tresorerieService.saveCollection(res)
              .subscribe((data: any) => {
                this.dataSource = data;
                this.loader.close();
                this.snack.open('Encaissement ajouté!', 'OK', { duration: 2000 });
                this.getTresorerieList();
              }, error => {
                this.loader.close();
                this.snack.open('Erreur lors de la sauvegarde de l\'encaissement.', 'OK', { duration: 2000 });
                console.error('Error saving collection:', error);
              });
          } else {
            // Form validation failed, handle error
            // For example, show an error message to the user
            console.log('Form validation failed');
            this.loader.close();
            this.snack.open('Le formulaire contient des erreurs.', 'OK', { duration: 2000 });
          }
        } else {
          this.loader.open('Modifier encaissement');
          if (this.validateForm(res)) {
            this.tresorerieService.updateCollection(data.id, res)
              .subscribe((data: any) => {
                this.dataSource = data;
                this.loader.close();
                this.snack.open('Encaissement modifié!', 'OK', { duration: 2000 });
                this.getTresorerieList();
              }, error => {
                this.loader.close();
                this.snack.open('Erreur lors de la mise à jour de l\'encaissement.', 'OK', { duration: 2000 });
                console.error('Error updating collection:', error);
              });
          } else {
            // Form validation failed, handle error
            // For example, show an error message to the user
            console.log('Form validation failed');
            this.loader.close();
            this.snack.open('Le formulaire contient des erreurs.', 'OK', { duration: 2000 });
          }
        }
      });
  }
  
  validateForm(formValue: any): boolean {
    if (
      formValue.category &&
      formValue.billClientId &&
      formValue.date &&
      formValue.description
    ) {
      return true;
    } else {
      return false;
    }
  }
  
  

  
}  