import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { InvoiceClient } from 'app/shared/models/invoiceClient.model';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-invoice-client-list',
  templateUrl: './invoice-client-list.component.html',
  styleUrls: ['./invoice-client-list.component.scss']
})
export class InvoiceClientListComponent implements OnInit {

  @ViewChild(MatTable) itemTable: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  invoiceClientList: InvoiceClient[];
  filteredInvoiceClients: InvoiceClient[] = [];

  itemTableColumn: string[] = [
    "invoiceNumber",
    "nameBuyer",
    "totalWithDiscount",
    "currency",
    "date",
    "invoiceEtat",
    "Actions",
  ];
  startIndex = 1;
  itemsToDisplay: any;
  invoiceClients: any;
  dataSource: MatTableDataSource<InvoiceClient>;
  invoiceNumberFilter='';
  nameSellerFilter='';
  nameBuyerFilter='';
  invoiceEtatFilter='';

  constructor(
    private clientService: ClientService,
    private confirmService: AppConfirmService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
  this.getInvoiceClientList();

 
}

  getInvoiceClientList() {
    this.clientService.getInvoiceClientList().subscribe((res: InvoiceClient[]) => {
      this.invoiceClientList = res;
      this.filteredInvoiceClients = this.invoiceClientList;
      this.dataSource = new MatTableDataSource(this.filteredInvoiceClients);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  handlePageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.itemsToDisplay = this.invoiceClients.slice(startIndex, endIndex);
    this.dataSource = new MatTableDataSource<InvoiceClient>(this.itemsToDisplay);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  


  deleteInvoiceClientById(id) {
    this.confirmService
      .confirm({
        title: "Confirmer",
        message: "Voulez-vous supprimer cette facture?",
      })
      .subscribe((result) => {
        if (result === true) {
          this.clientService.deleteInvoiceClient(id)
            .subscribe(
              (res) => {
                this.invoiceClientList = this.invoiceClientList.filter(
                  (invoiceClient) => invoiceClient.id !== id
                );
                this.getInvoiceClientList();
                this.cdr.detectChanges();
              },
              (error: any) => {
                console.error('Delete invoice error:', error);
                // Show alert error
                alert('Facture existe dans encaissement.');
                // Additional error handling logic
              }
            );
        }
      });
  }
  



// fonction de filtrage
applyFilter(value: string, column: string) {
  // nettoyer et formater la valeur de recherche
  value = value.trim().toLowerCase();

  // appliquer le filtre à la source de données
  this.dataSource.filter = value;

  // réinitialiser la pagination si nécessaire
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }

  // définir un prédicat de filtre personnalisé pour la source de données
  this.dataSource.filterPredicate = (data: InvoiceClient, filter: string) => {
    // obtenir la valeur de la colonne de données pour la ligne actuelle
    const dataStr = data[column].toLowerCase();
    // renvoyer true si la valeur de la colonne inclut la valeur de recherche
    return dataStr.indexOf(filter) !== -1;
  };
}

amountFilter=null; // use null instead of 0
currencyFilter : string = '';
dateFilter: string;


filterInvoiceClients() {
  let temp: InvoiceClient[] = this.invoiceClientList;
  if (this.invoiceNumberFilter) {
  temp = temp.filter(
  (invoiceClient) =>
  invoiceClient.invoiceNumber
  .toLowerCase()
  .indexOf(this.invoiceNumberFilter.toLowerCase()) !== -1
  );
  }
  if (this.nameSellerFilter) {
  temp = temp.filter(
  (invoiceClient) =>
  invoiceClient.nameSeller
  .toLowerCase()
  .indexOf(this.nameSellerFilter.toLowerCase()) !== -1
  );
  }
  if (this.nameBuyerFilter) {
  temp = temp.filter(
  (invoiceClient) =>
  invoiceClient.nameBuyer
  .toLowerCase()
  .indexOf(this.nameBuyerFilter.toLowerCase()) !== -1
  );
  }
  if (this.invoiceEtatFilter) {
  temp = temp.filter(
  (invoiceClient) =>
  invoiceClient.invoiceEtat.toLowerCase() ===
  this.invoiceEtatFilter.toLowerCase()
  );
  }
   // Filter by amount
   if (this.amountFilter) {
    temp = temp.filter(
      (invoice) => invoice.totalWithDiscount === this.amountFilter
    );
  }

  // Filter by date
  if (this.dateFilter) {
    temp = temp.filter(
      (invoice) => {
        const filterDate = new Date(this.dateFilter);
        const invoiceDate = new Date(invoice.date);
        return (
          invoiceDate.getFullYear() === filterDate.getFullYear() &&
          invoiceDate.getMonth() === filterDate.getMonth() &&
          invoiceDate.getDate() === filterDate.getDate()
        );
      }
    );
  }

  // Filter by currency
  // if (this.currencyFilter) {
  //   temp = temp.filter(
  //     (invoice) => invoice.currency === this.currencyFilter
  //   );
  // }
  this.filteredInvoiceClients = temp;
  this.dataSource = new MatTableDataSource(this.filteredInvoiceClients);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  }


}