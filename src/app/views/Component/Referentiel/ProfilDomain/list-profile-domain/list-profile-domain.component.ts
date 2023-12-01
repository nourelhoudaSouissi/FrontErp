import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProfileDomain } from 'app/shared/models/ProfileDomain';
import { Subscription } from 'rxjs';
import { ProfileDomainService } from '../profile-domain.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CreateProfileDomainComponent } from '../create-profile-domain/create-profile-domain.component';
import { ViewProfileDomainComponent } from '../view-profile-domain/view-profile-domain.component';

@Component({
  selector: 'app-list-profile-domain',
  templateUrl: './list-profile-domain.component.html',
  styleUrls: ['./list-profile-domain.component.scss']
})
export class ListProfileDomainComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource:MatTableDataSource<ProfileDomain>;
  displayedColumns: string[];
  public getItemSub: Subscription;
  constructor( 
    private dialog: MatDialog,
    private snack: MatSnackBar,

    private profileDomainService: ProfileDomainService ,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService) { 
      this.dataSource = new MatTableDataSource<ProfileDomain>([]);
    }

 

  ngOnInit(): void {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems();
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

  getDisplayedColumns() {
    return ['title', 'description', 'actions'];
  }


  getItems() {    
    this.getItemSub = this.profileDomainService.getItems()
      .subscribe((data:any)  => {
        data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }

  
  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Ajouter  un Domaine de Profile' : 'Modifier un Domaine de Profile';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CreateProfileDomainComponent, {
      width: '900px',
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
          this.loader.open('Ajout Domaine de Profile en cours');
          this.profileDomainService.addItem(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Domaine de Profile ajouté avec succès !', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
          this.loader.open('Modifier Domaine de Profile');
          this.profileDomainService.updateItem(data.id, res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Domaine de Profile modifié avec succès !', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  deleteItem(row) {
    
    this.confirmService.confirm({message: `Etes vous sur de la suppression ?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('supprimer Domaine de Profile');
          this.profileDomainService.deleteItem(row.id)
          .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Domaine de Profile supprimé!', 'OK', { duration: 4000 })
              this.getItems();
            })
        }
      })
  }


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

 
  openPopUpView(row: any): void {
    const dialogRef = this.dialog.open(ViewProfileDomainComponent, {
      width: '700px',
      data:  { profileDomain : row},
    });
    dialogRef.afterOpened().subscribe(() => {
      console.log('Dialog opened successfully.');
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      // Code executed after the dialog is closed
    }, error => {
      console.error('An error occurred while opening the dialog:', error);
      // Handle the error appropriately (e.g., display an error message)
    });
  }
 
  
  
  

/*************************** Apply filter global  **************************/
applyFilter(event :Event){
  const FilterValue = (event.target as HTMLInputElement).value ;
   this.dataSource.filter = FilterValue.trim().toLowerCase();

}

}
