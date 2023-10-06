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
import { contact } from 'app/shared/models/contact';
import { NgxTablePopupComponent } from 'app/views/cruds/crud-ngx-table/ngx-table-popup/ngx-table-popup.component';
import { ContactPopComponent } from '../../contact-pop/contact-pop/contact-pop.component';
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
  
  
  constructor( private snack: MatSnackBar,
              private dialog: MatDialog,
              private loader: AppLoaderService,
              private contactService :ContactService,
              private confirmService: AppConfirmService ) {
    this.dataSource = new MatTableDataSource<contact>([]);
    }
   
   
   getDisplayedColumns() {
    return ['firstName','lastName','function','actions'];
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
  this.confirmService.confirm({message: `Delete ${row.name}?`})
    .subscribe(res => {
      if (res) {
        this.loader.open('Deleting Partner');
        this.contactService.deleteItem(row)
          .subscribe((data:any)=> {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Partner deleted!', 'OK', { duration: 2000 });
            this.getItems();
          })
      }
    })
}

openPopUp(data: any = {}, isNew?) {
  let title = isNew ? 'Nouveau contact' : 'Mettre à jour contact';
  let dialogRef: MatDialogRef<any> = this.dialog.open(ContactPopComponent, {
    width: '720px',
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
        this.contactService.addItem(res)
          .subscribe((data:any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Contact ajouté avec succès!', 'OK', { duration: 4000 })
            this.getItems();
          })
      } else {
        this.loader.open('Mise à jour');
        this.contactService.updateItem(data._id, res)
          .subscribe((data :any) => {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Contact mis à jour avec succès!', 'OK', { duration: 4000 })
            this.getItems();
          })
      }
    })
}

}


