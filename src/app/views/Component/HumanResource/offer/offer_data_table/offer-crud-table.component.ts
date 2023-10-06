
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Civility, MaritalSituation, Provenance, Title } from 'app/shared/models/Employee';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { OfferService } from '../offer.service';
import { Offer } from 'app/shared/models/Offer';
import { OfferPopupComponent } from '../offer-popup/offer-popup.component';
import { ViewOfferComponent } from '../view-offer/view-offer.component';

@Component({
  selector: 'offer-crud',
  templateUrl: './offer-crud-table.component.html'
})


export class OfferCrudTableComponent implements OnInit {
  formData = {}
  console = console;
  
  public itemForm: FormGroup;;
 
  selectedFile: File;
  title :string[]= Object.values(Title);

  formWidth = 200; //declare and initialize formWidth property
  formHeight = 700; //declare and initialize formHeight property
 

  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  public dataSource: MatTableDataSource<Offer>;
  public displayedColumns: any;
  public getItemSub: Subscription;
 


  constructor(
    private router : Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudService: OfferService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) {     this.dataSource = new MatTableDataSource<Offer>([]);}

  ngOnInit() {
   this.displayedColumns = this.getDisplayedColumns();
    this.getItems()  
  }

  getDisplayedColumns() {
    return ['reference','title','startDate','endDate','actions' ];
  }


  applyFilterReference(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.filterPredicate = (data, filter) => {
      return data.reference.trim().toLowerCase().indexOf(filter) !== -1;
    };
  }
  applyFilterTitle(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.filterPredicate = (data, filter) => {
      return data.title.trim().toLowerCase().indexOf(filter) !== -1;
    };
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
        data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }

  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Ajouter une nouvelle offre' : 'Modifier offre';
    let dialogRef: MatDialogRef<any> = this.dialog.open(OfferPopupComponent, {
      width: '800px',
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
              this.snack.open('Offre ajoutée avec succès!', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
          this.loader.open('modification en cours');
          this.crudService.updateItem(data.id,res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Offre modifiée avec succées !', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }


  deleteItem(row) {
    this.confirmService.confirm({message: `Voulez vous supprimer cette offre ?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Supprssion de l`offre');
          this.crudService.deleteItem(row)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Offre supprimée!', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  openPopUpView(row: any): void {
    const dialogRef = this.dialog.open(ViewOfferComponent, {
      width: '800px',
      data:  { offre : row},
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
  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }
 Affiche(id: number){
  this.router.navigate(["affichageOffer/affichageOffer", id]);
}
}
