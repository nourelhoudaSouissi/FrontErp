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
import { CompanyStatus, LegalStatus, Partner, Provenance, WorkField } from 'app/shared/models/Partner';
import { Router } from '@angular/router';
import { PartnerStepperComponent } from '../partner-stepper/partner-stepper.component';



@Component({
  selector: 'app-crud-ngx-table',
  templateUrl: './crud-ngx-table.component.html',
  animations: egretAnimations
})

export class CrudNgxTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  public dataSource: MatTableDataSource<Partner>;
  public displayedColumns: any;
  public getItemSub: Subscription;
 

  queryParamsObject = { key: 'value' };
  
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
    return ['logo','companyStatus','ref','name','blocked','actions'];
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
    this.getItemSub = this.crudService.getItems().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  
      // Iterate over the rows of the MatTableDataSource
      for (const item of this.dataSource.data) {
        this.clientSupplierPartner(item);
        console.log(item.companyStatus);
      }
    });
  }
  

  
openCreatePopUp(data: any = {}, isNew?) {
  let title =  'Nouveau Partenaire' ;
  let dialogRef: MatDialogRef<any> = this.dialog.open(PartnerStepperComponent, {
    height: '620px',
    width: '920px',
    disableClose: true,
    data: { title: title, payload: data }
  })
  console.log(data.contactId)
  dialogRef.afterClosed()
    .subscribe(res => {
      if(!res) {
        // If user press cancel
        return;
      }
    
        this.loader.open('Ajout en cours');
        this.crudService.addItem(res)
          .subscribe((data:any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Contact ajouté avec succès!', 'OK', { duration: 4000 })
            this.getItems();
          })
     
    })
}



  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Nouveau partenaire' : 'Modifier Partenaire';
    let dialogRef: MatDialogRef<any> = this.dialog.open(NgxTablePopupComponent, {
      width: '920px',
      height: '620px',
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
    this.confirmService.confirm({message: `Supprimer ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Suppression du partenaire');
          this.crudService.deleteItem(row.id)
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

  // Mapper function to map 'blocked' field values to labels
  mapBlockedStatus(blocked: boolean): string {
    return blocked ? 'Bloqué' : 'Actif';
  }

  clientSupplierPartner(item){
    const refs = item.refs
    
    for (let i=0 ; i < refs.length ; i++) {
      if (refs[i].startsWith('CL')) {
        for (let j=0 ; j < refs.length ; j++) {
          if (refs[j].startsWith('FR')){
            item.companyStatus = CompanyStatus.CLIENT_SUPPLIER
            break
          }
        }
        break
      }
    }
  }

  CompanyStatusMap = {
    [CompanyStatus.PROSPECT]:'Prospect',
    [CompanyStatus.SUPPLIER]:'Fournisseur',
    [CompanyStatus.CLIENT]:'Client',
    [CompanyStatus.ARCHIVED] :'Archivé',
    [CompanyStatus.CLIENT_SUPPLIER] :'Client / Fournisseur'
  };

  provenanceMap = {
    [Provenance.JOBS_FORUM]:'Salon des entreprises',
    [Provenance.RECOMMENDATION]:'Recommendation',
   [Provenance.COOPERATION]:'Coopération',
   [Provenance.OTHER] :'Autre'
  };

  workFieldMap = {
    [WorkField.IT]:'IT',
    [WorkField.INDUSTRY]:'Industrie',
   [WorkField.SALES]:'Ventes',
   [WorkField.AGRICULTURE] :'Agriculture',
   [WorkField.BANKING] :'Banking',
   [WorkField.E_COM] :'E-Commerce',
   [WorkField.ASSURANCE] :'Assurance',
   [WorkField.FINANCE] :'Finance'
  };

  legalStatusMap = {
    [LegalStatus.SA]:'SA',
    [LegalStatus.SARL]:'SARL'
  };
}