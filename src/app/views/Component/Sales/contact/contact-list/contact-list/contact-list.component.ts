import { Component, OnDestroy, OnInit,ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { ContactService } from '../../contact.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service'; 
import { Civility, contact } from 'app/shared/models/contact';
import { ContactPopComponent } from '../../contact-pop/contact-pop/contact-pop.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  animations: egretAnimations
})
export class ContactListComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource: MatTableDataSource<contact>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  
  
  constructor(
    private router: Router,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private contactService: ContactService,
    private confirmService: AppConfirmService
  ) {
      this.dataSource = new MatTableDataSource<contact>([]);
    }
   
   
   getDisplayedColumns() {
    return ['civility','firstName','lastName','appointmentMaking','actions'];
  }


  ngOnInit(): void {
  
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()
  }

  getItems() {    
    this.getItemSub =this.contactService.getItems().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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

  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }
 
 deleteItem(row) {
  this.confirmService.confirm({message: `Supprimer ce contact ${row.fullName}?`})
    .subscribe(res => {
      if (res) {
        this.loader.open('Suppression contact en cours');
        this.contactService.deleteContact(row.contactId)
          .subscribe((data:any)=> {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Contact supprimé !', 'OK', { duration: 2000 });
            this.getItems();
          })
      }
    })
}


openPopUp(data: any = {}, isNew?) {
  let title = isNew ? 'Nouveau contact' : 'Mettre à jour contact';
  let dialogRef: MatDialogRef<any> = this.dialog.open(ContactPopComponent, {
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
      if (isNew) {
        this.loader.open('Ajout en cours');
        this.contactService.addContact(res)
          .subscribe((data:any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Contact ajouté avec succès!', 'OK', { duration: 4000 })
            this.getItems();
          })
      } else {
        this.loader.open('Mise à jour');
        this.contactService.updateContact(data.contactId, res)
          .subscribe((data :any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Contact mis à jour avec succès!', 'OK', { duration: 4000 })
            this.getItems();
          })
      }
    })
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

civilityMap = {
  [Civility.MR]:'Mr',
  [Civility.MRS]:'Mme',
  [Civility.MS] : 'Mlle'
}

appointmentMakingMap = {
  true: 'Oui',
  false: 'Non'
};
}


