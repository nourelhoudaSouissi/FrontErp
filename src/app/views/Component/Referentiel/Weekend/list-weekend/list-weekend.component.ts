import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Weekend } from 'app/shared/models/weekend';
import { Subscription } from 'rxjs';
import { WeekendService } from '../weekend.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CreateWeekendComponent } from '../create-weekend/create-weekend.component';
import { ViewWeekendComponent } from '../view-weekend/view-weekend.component';

@Component({
  selector: 'app-list-weekend',
  templateUrl: './list-weekend.component.html',
  styleUrls: ['./list-weekend.component.scss']
})
export class ListWeekendComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource:MatTableDataSource<Weekend>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  constructor( 
    private dialog: MatDialog,
    private snack: MatSnackBar,

    private weekendService: WeekendService ,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService) { 
      this.dataSource = new MatTableDataSource<Weekend>([]);
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
    return ['reference', 'name', 'startDay', 'endDay', 'actions'];
  }


  getItems() {    
    this.getItemSub = this.weekendService.getItems()
      .subscribe((data:any)  => {
        data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }


  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Ajouter  un Weekend' : 'Modifier un Weekend';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CreateWeekendComponent, {
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
          this.loader.open('Ajout Weekend en cours');
          this.weekendService.addItem(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Weekend ajouté avec succès !', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
          this.loader.open('Modifier Weekend');
          this.weekendService.updateItem(data.id, res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Weekend modifié avec succès !', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  deleteItem(row) {
    
    this.confirmService.confirm({message: `Etes vous sur de la suppression ?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('supprimer Weekend');
          this.weekendService.deleteItem(row.id)
          .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('weekend supprimé!', 'OK', { duration: 4000 })
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
    const dialogRef = this.dialog.open(ViewWeekendComponent, {
      width: '700px',
      data:  { weekend : row},
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
  getDayOfWeekStart(startDay: string): { displayText: string } {
    const DAY_OF_WEEK_DATA = {  
      MONDAY: {  displayText: 'Lundi' },
      TUESDAY: { displayText: 'Mardi' },
      WEDNESDAY: { displayText: 'Mercredi' },
      THURSDAY: { displayText: 'Jeudi' },
      FRIDAY: { displayText: 'Vendredi' },
      SATURDAY: { displayText: 'Samedi' },
      SUNDAY: { displayText: 'Dimanche' },
    };
    return DAY_OF_WEEK_DATA[startDay];
  }
  
  getDayOfWeekEnd(endDay: string): { displayText: string } {
    const DAY_OF_WEEK_DATA = {  
      MONDAY: {  displayText: 'Lundi' },
      TUESDAY: { displayText: 'Mardi' },
      WEDNESDAY: { displayText: 'Mercredi' },
      THURSDAY: { displayText: 'Jeudi' },
      FRIDAY: { displayText: 'Vendredi' },
      SATURDAY: { displayText: 'Samedi' },
      SUNDAY: { displayText: 'Dimanche' },
    };
    return DAY_OF_WEEK_DATA[endDay];
  }
  
  

/*************************** Apply filter global  **************************/
applyFilter(event :Event){
  const FilterValue = (event.target as HTMLInputElement).value ;
   this.dataSource.filter = FilterValue.trim().toLowerCase();

}


}
