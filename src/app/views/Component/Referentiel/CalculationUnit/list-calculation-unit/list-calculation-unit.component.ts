import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CalculationUnit } from 'app/shared/models/CalculationUnit';
import { Subscription } from 'rxjs';
import { CalculationUnitService } from '../calculation-unit.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CreateCalculationUnitComponent } from '../create-calculation-unit/create-calculation-unit.component';
import { ViewCalculationUnitComponent } from '../view-calculation-unit/view-calculation-unit.component';

@Component({
  selector: 'app-list-calculation-unit',
  templateUrl: './list-calculation-unit.component.html',
  styleUrls: ['./list-calculation-unit.component.scss']
})
export class ListCalculationUnitComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource:MatTableDataSource<CalculationUnit>;
  displayedColumns: string[];
  public getItemSub: Subscription;
  constructor( 
    private dialog: MatDialog,
    private snack: MatSnackBar,

    private calculationUnitService: CalculationUnitService ,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService) { 
      this.dataSource = new MatTableDataSource<CalculationUnit>([]);
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
    return ['code', 'title', 'description', 'actions'];
  }


  getItems() {    
    this.getItemSub = this.calculationUnitService.getItems()
      .subscribe((data:any)  => {
        data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }

  
  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Ajouter  une Unité' : 'Modifier une Unité';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CreateCalculationUnitComponent, {
      width: '900px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {MatDialog
          // If user press cancel
          return;
        }
        if (isNew) {
          this.loader.open('Ajout Unité en cours');
          this.calculationUnitService.addItem(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Unité ajouté avec succès !', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
          this.loader.open('Modifier Unité');
          this.calculationUnitService.updateItem(data.id, res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Unité modifié avec succès !', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  deleteItem(row) {
    
    this.confirmService.confirm({message: `Etes vous sur de la suppression ?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('supprimer Code Tva');
          this.calculationUnitService.deleteItem(row.id)
          .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Unité supprimé!', 'OK', { duration: 4000 })
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
    const dialogRef = this.dialog.open(ViewCalculationUnitComponent, {
      width: '700px',
      data:  { calculationUnit : row},
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
