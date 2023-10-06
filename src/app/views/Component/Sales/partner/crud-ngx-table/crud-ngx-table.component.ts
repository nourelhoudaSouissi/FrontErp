import { CrudPartnerService } from './../crudPartner.service';
import { AppLoaderService } from './../../../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxTablePopupComponent } from './ngx-table-popup/ngx-table-popup.component';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Partner } from 'app/shared/models/Partner';
import { Router } from '@angular/router';



@Component({
  selector: 'app-crud-ngx-table',
  styleUrls: ['crud.scss'],
  templateUrl: './crud-ngx-table.component.html',
  animations: egretAnimations
})

export class CrudNgxTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  public dataSource: MatTableDataSource<Partner>;
  public displayedColumns: any;
  public getItemSub: Subscription;
 


  constructor(
    private router : Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudService: CrudPartnerService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) {     this.dataSource = new MatTableDataSource<Partner>([]);}


  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()  
  }

  getDisplayedColumns() {
    return ['name','parentCompany','ceoName','Country','CompanyStatus','actions'];
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
    this.getItemSub = this.crudService.getItems()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }

  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Nouveau partenaire' : 'Modifier Partenaire';
    let dialogRef: MatDialogRef<any> = this.dialog.open(NgxTablePopupComponent, {
      width: '1000px',
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
          this.loader.open('Ajout en cours');
          this.crudService.addItem(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Partenaire ajouté avec succès!', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
          this.loader.open('modification en cours');
          this.crudService.updateItem(data.id,res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Partenaire modifié avec succées !', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }
  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Supprission du partenaire');
          this.crudService.deleteItem(row)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Partenaire supprimé!', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }
add(){
  this.router.navigateByUrl('add-partner/add-partner');
}
  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }
/*moreAboutItem(itemId: number) {
    // Open menu and listen for menu item selection
  }

  handleMenuItemSelection(menuItem: string, itemId: number) {
    // Redirect to appropriate interface based on menu item selection
    if (menuItem === 'requirement') {
      this.router.navigate(['/requirements', itemId]);
    } else if (menuItem === 'contacts') {
      this.router.navigate(['/contacts', itemId]);
    }
  }*/
}