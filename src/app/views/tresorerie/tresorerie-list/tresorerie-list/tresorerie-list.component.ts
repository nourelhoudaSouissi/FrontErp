import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TresorerieService } from '../../tresorerie.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { MatPaginator } from '@angular/material/paginator';
import { TresoreriePopUpComponent } from './tresorerie-pop-up/tresorerie-pop-up.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Caisse } from 'app/shared/models/caisse.model';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-tresorerie-list',
  templateUrl: './tresorerie-list.component.html',
  styleUrls: ['./tresorerie-list.component.scss']
})
export class TresorerieListComponent implements OnInit {
 
 
  displayedColumns: string[] = [ 'categoryCaisse', 'client', 'amount', 'date', 'action'];
   dataSource = new MatTableDataSource<Caisse>([]);
   tresorerieList: Caisse[];
   showEditOption = false;
   editedTresorerie: Caisse;

   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
  itemsToDisplay: any;
  tresoreries: any;
  filteredTresoreries: Caisse[] = [];
  

   constructor(private tresorerieService: TresorerieService,
    private confirmService: AppConfirmService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    ) {}

  

   getTresorerieList() {
    this.tresorerieService.getCaisseList().subscribe((res: Caisse[]) => {
      this.tresorerieList = res;
      this.filteredTresoreries = this.tresorerieList;
      this.dataSource = new MatTableDataSource(this.filteredTresoreries);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
   buildTresorerieForm(tresorerie: Caisse) {
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
          this.tresorerieService.deleteCaisse(id).subscribe((res) => {
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
    this.dataSource = new MatTableDataSource<Caisse>(this.itemsToDisplay);
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

  categoryCaisseFilter: string = '';
  descriptionFilter : '' ;
  filterTresorerie() {
    let temp: Caisse[] = this.tresorerieList;
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
    if (this.amountFilter !== null) {
      temp = temp.filter((tresorerie) =>
        tresorerie.amount === this.amountFilter
      );
    }
    if (this.descriptionFilter) {
      temp = temp.filter((disbursement) =>
        disbursement.description.toLowerCase().includes(this.descriptionFilter.toLowerCase())
      );
    }
    if (this.categoryCaisseFilter) {
      temp = temp.filter((tresorerie) => tresorerie.categoryCaisse === this.categoryCaisseFilter);
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
    return this.dataSource.filteredData.reduce((acc, curr) => acc + curr.amount, 0);
  }

  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Ajouter nouveau encaissement' : 'modifier encaissement';
    let dialogRef: MatDialogRef<any> = this.dialog.open(TresoreriePopUpComponent, {
      width: '50%',
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
          this.loader.open('Ajouter nouveau encaissement');
          this.tresorerieService.saveCaisse(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Encaissement ajouté!', 'OK', { duration: 2000 });
              this.getTresorerieList();
            })
        } else {
          this.loader.open('Modifier encaissement');
          this.tresorerieService.updateCaisse(data.id,res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Encaissement modifié!', 'OK', { duration: 2000 });
              this.getTresorerieList();
            })
        }
      })
  }
  
}  