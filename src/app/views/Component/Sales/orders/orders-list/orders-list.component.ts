import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from 'app/shared/models/Order';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { OrdersService } from '../orders.service';
import { QuotationService } from '../../quotation/quotation.service';
import { Quotation } from 'app/shared/models/Quotation';
import { ReqService } from '../../Requirement/req.service';
import { req } from 'app/shared/models/req';
import { CrudPartnerService } from '../../partner/crudPartner.service';
import { Partner } from 'app/shared/models/Partner';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  animations: egretAnimations,
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource: MatTableDataSource<Order>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private orderService: OrdersService,
    private quotationService: QuotationService,
    private reqService: ReqService,
    private partnerService: CrudPartnerService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) {
    this.dataSource = new MatTableDataSource<Order>([]);
  }

  ngOnInit(): void {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()
  }

  getDisplayedColumns() {
    return [
      'ref', 'quotationRef', 'reqTitle','partnerName', 'actions'
    ];
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

  getItems() {    
    this.getItemSub = this.orderService.getOrders()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource<Order>(data);
        data.forEach((order: Order) => {
          this.quotationService.getQuotation(order.quotationId).subscribe(
            (quotation: Quotation) => {
              order.quotationRef = quotation.ref 
            },
            (error: any) => {
              console.error('Error fetching quotation:', error);
            }
          );
          this.reqService.getItem(order.requirementNum).subscribe(
            (requirement: req) => {
              order.reqTitle = requirement.title 
            },
            (error: any) => {
              console.error('Error fetching requirement:', error);
            }
          );
          this.partnerService.getItem(order.partnerNum).subscribe(
            (partner: Partner) => {
              order.partnerName = partner.name 
            },
            (error: any) => {
              console.error('Error fetching partner:', error);
            }
          );
        });
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource)
      })

  }


  deleteItem(row) {
    this.confirmService.confirm({message: `Supprimer ${row.ref}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Suppression commande en cours');
          this.orderService.deleteOrder(row.id)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Commande supprimée !', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
  }
    
  ////////////filtrer  par colonne //////////////
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
