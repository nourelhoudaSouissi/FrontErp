import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { InvoiceService } from "../invoice.service";
import { AppConfirmService } from "app/shared/services/app-confirm/app-confirm.service";
import { CurrencyEnum, Invoice } from "app/shared/models/invoice.model";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-invoice-list",
  templateUrl: "./invoice-list.component.html",
  styleUrls: ["./invoice-list.component.scss"]
})
export class InvoiceListComponent implements OnInit {
  @ViewChild(MatTable) itemTable: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  invoiceList: Invoice[];
  filteredInvoices: Invoice[] = [];
  currencies: { shortName: string, name: string, description: string }[] = [];

  filterCurrencies(value: string) {
    if (!value) {
      this.currencies = Object.keys(CurrencyEnum).map(key => ({
        shortName: key,
        name: CurrencyEnum[key],
        description: ''
      }));
      return;
    }
    const filterValue = value.toLowerCase();
    this.currencies = Object.keys(CurrencyEnum)
      .filter(key => CurrencyEnum[key].toLowerCase().includes(filterValue))
      .map(key => ({
        shortName: key,
        name: CurrencyEnum[key],
        description: ''
      }));
  }
  
  itemTableColumn: string[] = [
    "invoiceNumber",
    "nameSeller",
    "totalWithDiscount",
    "currency",
    "date",
    "invoiceEtat",
    "Actions",
  ];
  startIndex = 1;
  itemsToDisplay: any;
  invoices: any;
  dataSource: MatTableDataSource<Invoice>;
  invoiceNumberFilter = '';
  nameSellerFilter = '';
  nameBuyerFilter = '';
  invoiceEtatFilter = '';

  constructor(
    private invoiceService: InvoiceService,
    private confirmService: AppConfirmService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getInvoiceList();
  }

  getInvoiceList() {
    this.invoiceService.getInvoiceList().subscribe((res: Invoice[]) => {
      this.invoiceList = res;
      this.filteredInvoices = this.invoiceList;
      this.dataSource = new MatTableDataSource(this.filteredInvoices);
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
    this.itemsToDisplay = this.invoices.slice(startIndex, endIndex);
    this.dataSource = new MatTableDataSource<Invoice>(this.itemsToDisplay);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  deleteInvoiceById(id) {
    this.confirmService
      .confirm({
        title: "Confirmer",
        message: "Voulez-vous supprimer cette facture?",
      })
      .subscribe((result) => {
        if (result === true) {
          this.invoiceService.deleteInvoice(id).subscribe(
            (res) => {
              this.invoiceList = this.invoiceList.filter(
                (invoice) => invoice.id !== id
              );
              this.getInvoiceList();
              this.cdr.detectChanges();
            },
            (error: any) => {
              console.error('Delete invoice error:', error);
              // Show alert error
              alert('Facture existe dans decaissement.');
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
    this.dataSource.filterPredicate = (data: Invoice, filter: string) => {
      // obtenir la valeur de la colonne de données pour la ligne actuelle
      const dataStr = data[column].toLowerCase();
      // renvoyer true si la valeur de la colonne inclut la valeur de recherche
      return dataStr.indexOf(filter) !== -1;
    };
  }

  amountFilter: number = null; // use null instead of 0
  currencyFilter: CurrencyEnum = null;
  dateFilter: string;
  filterInvoices() {
    let temp: Invoice[] = this.invoiceList;
    if (this.invoiceNumberFilter) {
      temp = temp.filter(
        (invoice) =>
          invoice.invoiceNumber
            .toLowerCase()
            .indexOf(this.invoiceNumberFilter.toLowerCase()) !== -1
      );
    }
    if (this.nameSellerFilter) {
      temp = temp.filter(
        (invoice) =>
          invoice.nameSeller
            .toLowerCase()
            .indexOf(this.nameSellerFilter.toLowerCase()) !== -1
      );
    }
    if (this.nameBuyerFilter) {
      temp = temp.filter(
        (invoice) =>
          invoice.nameBuyer
            .toLowerCase()
            .indexOf(this.nameBuyerFilter.toLowerCase()) !== -1
      );
    }
  
    if (this.invoiceEtatFilter) {
      temp = temp.filter(
        (invoice) =>
          invoice.invoiceEtat.toLowerCase() ===
          this.invoiceEtatFilter.toLowerCase()
      );
    }
  
    // Filter by amount and currency
    temp = temp.filter((invoice) => {
      let amountMatches = true;
      let currencyMatches = true;
  
      if (this.amountFilter !== null) {
        amountMatches = invoice.totalWithDiscount === this.amountFilter;
      }
  
    // Filter by currency
    if (this.currencyFilter) {
      const filterCurrency = this.currencies.find(currency => currency.shortName === this.currencyFilter);
      temp = temp.filter((invoice) => invoice.currency === filterCurrency);
    }
    
      return amountMatches && currencyMatches;
    });
  
    // Filter by date
    if (this.dateFilter) {
      temp = temp.filter((invoice) => {
        const filterDate = new Date(this.dateFilter);
        const invoiceDate = new Date(invoice.date);
        return (
          invoiceDate.getFullYear() === filterDate.getFullYear() &&
          invoiceDate.getMonth() === filterDate.getMonth() &&
          invoiceDate.getDate() === filterDate.getDate()
        );
      });
    }
  
    this.filteredInvoices = temp;
    this.dataSource = new MatTableDataSource(this.filteredInvoices);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
}
