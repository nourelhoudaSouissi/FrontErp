import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProfileReference } from 'app/shared/models/ProfileReference';
import { Subscription } from 'rxjs';
import { ProfileService } from '../profile.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CreateProfileComponent } from '../create-profile/create-profile.component';
import { ViewProfileComponent } from '../view-profile/view-profile.component';

@Component({
  selector: 'app-list-profile',
  templateUrl: './list-profile.component.html',
  styleUrls: ['./list-profile.component.scss']
})
export class ListProfileComponent implements OnInit {


  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource:MatTableDataSource<ProfileReference>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  constructor( 
    private dialog: MatDialog,
    private snack: MatSnackBar,

    private profileService: ProfileService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService) { 
      this.dataSource = new MatTableDataSource<ProfileReference>([]);
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
    return ['function', 'experience', 'yearsOfExperience','technologie','description',  'actions'];
  }


  getItems() {    
    this.getItemSub = this.profileService.getItems()
      .subscribe((data:any)  => {
        data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }


  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Ajouter  un profile' : 'Modifier un profile';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CreateProfileComponent, {
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
          this.loader.open('Ajout profile en cours');
          this.profileService.addItem(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Profile ajouté avec succès !', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
          this.loader.open('Modifier profile');
          this.profileService.updateItem(data.id, res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Profile modifié avec succès !', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  deleteItem(row) {
    
    this.confirmService.confirm({message: `Etes vous sur de la suppression ?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('supprimer Service');
          this.profileService.deleteItem(row.id)
          .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Profile supprimé!', 'OK', { duration: 4000 })
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
    const dialogRef = this.dialog.open(ViewProfileComponent, {
      width: '700px',
      data:  { profile : row},
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
 
   
  getDayOfWeekEnd(experience: string): { displayText: string } {
    const EXPERIENCE_DATA = {  
      JUNIOR: {  displayText: 'Junior' },
      CONFIRMED: { displayText: 'Confirmé' },
      SENIOR: { displayText: 'Senior' },
      EXPERT: { displayText: 'Expert' },
    
    };
    return EXPERIENCE_DATA[experience];
  }
  
  

/*************************** Apply filter global  **************************/
applyFilter(event :Event){
  const FilterValue = (event.target as HTMLInputElement).value ;
   this.dataSource.filter = FilterValue.trim().toLowerCase();

}
}
