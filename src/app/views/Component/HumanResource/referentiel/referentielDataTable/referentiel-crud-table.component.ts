import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {FormGroup} from '@angular/forms';
import { Title } from 'app/shared/models/Employee';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { referentielService } from '../referentiel.service';
import { QuestionCategory } from 'app/shared/models/QuestionCategory';
import { ExperienceLevel } from 'app/shared/models/AssOfferCandidate';
import { QuestionType } from 'app/shared/models/QuestionType';

@Component({
  selector: 'referentiel-crud',
  templateUrl: './referentielcrud-table.component.html',
})


export class referentielCrudTableComponent implements OnInit {


  formData = {}
  console = console;
  ExperienceLevel :string []= Object.values(ExperienceLevel);
  public itemForm: FormGroup;;
 
  selectedFile: File;
  title :string[]= Object.values(Title);
  showInput1 = false;
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
 

  public dataSource: MatTableDataSource<QuestionType>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  public getItemSub2: Subscription;
 

  constructor(
    private router : Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudService: referentielService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) 
  {this.dataSource = new MatTableDataSource<QuestionType>([]);}

  ngOnInit() {
   this.displayedColumns = this.getDisplayedColumns();
    this.getItems()  ;
  }

  getDisplayedColumns() {
    return ['questionTypeName','actions' ];
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
    this.getItemSub  = this.crudService.getAllQuestiontypes()
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        });
  }
    
  
  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Supprssion du questionnaire');
          this.crudService.deleteQuestionType(row)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Catégorie supprimée!', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }
 goToForm(){
  this.router.navigateByUrl('formReferentiel/referentielForm');
 }
 


 ExperienceLevelMap={
  [ExperienceLevel.JUNIOR]:'Junior',
  [ExperienceLevel.MID_LEVEL]:'Confirmé',
  [ExperienceLevel.SENIOR]:'Senior',
  [ExperienceLevel.EXPERT]:'Expert', }

  applyFilterr(event: Event, key: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const filterWords = filterValue.split(' ');
  
    this.dataSource.filterPredicate = (data, filter) => {
      // Split the data value into words and convert to lowercase
      const dataWords = data[key].trim().toLowerCase().split(' ');
  
      // Check if all filter words are present in the data (case-insensitive)
      return filterWords.every(word => {
        return dataWords.some(dataWord => dataWord.indexOf(word.toLowerCase()) !== -1);
      });
    };
  
    this.dataSource.filter = filterValue;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleInput1() {
    this.showInput1 = !this.showInput1;
  }
}
