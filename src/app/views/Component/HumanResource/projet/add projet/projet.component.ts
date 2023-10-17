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
import { Civility, Employee, MaritalSituation, Provenance, Title } from 'app/shared/models/Employee';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ProjectType, Projet } from 'app/shared/models/Projet';
import { ProjetService } from '../projet.service';
import { ProjetPopupComponent } from './projetPopup/ProjetPopup.component';
import { ResourceService } from '../../resource/resource.service';
import { DatePipe } from '@angular/common';
import { PhaseComponent } from './projetPopup/phase.component';


@Component({
  selector: 'projet-crud',
  templateUrl: './projet.component.html'
})


export class ProjetComponent implements OnInit {
  formData = {}
  console = console;
  
  public itemForm: FormGroup;;
 
  selectedFile: File;
  title :any[]= Object.values(Title);

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
 
  public dataSource: MatTableDataSource<Projet>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  resources : Employee[] =[];


  constructor(
    private router : Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudService: ProjetService,
    private resourceService: ResourceService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private datePipe: DatePipe,
  ) {     this.dataSource = new MatTableDataSource<Projet>([]);}

  ngOnInit() {
   this.displayedColumns = this.getDisplayedColumns();
    this.getItems()  
    
  }

  getDisplayedColumns() {
    return ['Reference','Type','Titre' , 'Date début' , 'Date fin', 'Actions' ];
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
    let title = isNew ? 'Nouveau projet' : 'Modifier projet';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ProjetPopupComponent, {
      width: '920px',
      height:'530px',
      disableClose: true,
      data: { title: title, payload: data , isNew: isNew }
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
              this.snack.open('Projet ajouté avec succès!', 'OK', { duration: 2000 });
              this.getItems();
            })
        } else {
            this.loader.open('modification en cours');
            this.crudService.updateItem(data.id,res)
              .subscribe((data:any) => {
                this.dataSource = data ;
                this.loader.close();
                this.snack.open('Projet modifié avec succées !', 'OK', { duration: 2000 });
                this.getItems();
              })
        }
      })
  }
  openPopUp2(projectId: number , isNew?) {
    let title = isNew ? 'Nouvelle Phase' : 'Ajouter phase';
    let dialogRef: MatDialogRef<any> = this.dialog.open(PhaseComponent, {
      width: '1000px',
      height:'400px',
      disableClose: true,
      data: { title: title, payload: projectId , isNew: isNew }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        
         }
     
          this.loader.open('Ajout en cours');
          this.crudService.addPhase(res,projectId)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Phase ajoutée avec succès!', 'OK', { duration: 2000 });
              this.getItems();
            })
      
      })
  }


deleteItem(row) {
    this.confirmService.confirm({message: `étes vous sure de supprission ?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Supprssion du projet');
          this.crudService.deleteItem(row)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('projet supprimé!', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }
 
 typeMap={
  [ProjectType.INTERN] :'Interne',
  [ProjectType.EXTERN_FORFAIT] : 'Forfait_Externe',
  [ProjectType.EXTERN_T_AND_M] : 'T_et_M_Externe'

 }
}