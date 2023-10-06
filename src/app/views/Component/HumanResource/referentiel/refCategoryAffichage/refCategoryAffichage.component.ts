
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup} from '@angular/forms';
import {  Title } from 'app/shared/models/Employee';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { QuestionCategory, QuestionnaireType } from 'app/shared/models/QuestionCategory';
import { ExperienceLevel } from 'app/shared/models/AssOfferCandidate';
import { QuestionType } from 'app/shared/models/QuestionType';
import { referentielService } from '../referentiel.service';

@Component({
  selector: 'referentiel-crud',
  templateUrl: './refCategoryAffichage.component.html',
  styleUrls: ['./refCategoryAffichage.component.scss'],
})


export class refCategoryAffichageComponent implements OnInit {
  formData = {}
  console = console;
  ExperienceLevel :string []= Object.values(ExperienceLevel);
  public itemForm: FormGroup;
  QuestionnaireType :string []= Object.values(QuestionnaireType);
 questionType:QuestionType;
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
 
  
  showInput1 = false;
  showInput2 = false;
  showInput3 = false;

  public dataSource: MatTableDataSource<QuestionCategory>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  public getItemSub2: Subscription;
  id: number;
  questionnaireType = Object.values(QuestionnaireType);

  constructor(
    private router : Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudService: referentielService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) 

  { this.dataSource = new MatTableDataSource<QuestionCategory>([]);}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.getQuestionsType();
   this.displayedColumns = this.getDisplayedColumns();
    this.getQuestions()  ;
  }

  getDisplayedColumns() {
    return ['name','level','questionnaireType','actions' ]; }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }


  
  getQuestions() {
    this.getItemSub =this.crudService.getQcategoryByQtype(this.id).subscribe((data:any)  => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
      }


  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Supprssion du questionnaire');
          this.crudService.deleteItem(row)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Questionnaire supprimée!', 'OK', { duration: 2000 });
              this.getQuestions();
            })
        }
      })
  }


  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }


 goToForm(){
  this.router.navigateByUrl('formReferentiel/referentielForm');}


 ExperienceLevelMap={
  [ExperienceLevel.JUNIOR]:'Junior',
  [ExperienceLevel.MID_LEVEL]:'Confirmé',
  [ExperienceLevel.SENIOR]:'Senior',
  [ExperienceLevel.EXPERT]:'Expert', }

  QuestionnaireTypeMap={
    [QuestionnaireType.FOR_EMPLOYEES]:'Pour Employées',
    [QuestionnaireType.FOR_CANDIDATES]:'Pour candidats',
  };

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
  
  applyFilterEnum(event: Event, key: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const filterWords = filterValue.split(' ');
  
    this.dataSource.filterPredicate = (data, filter) => {
      // Split the data value into words and convert to lowercase
      const dataWords = this.getEnumMappedValue(data[key]).trim().toLowerCase().split(' ');
  
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

  getEnumMappedValue(value: any): string {
    // Modify this function based on your enum mapping implementation
    // For example, if `value` is an enum value, you can use a mapping object to retrieve the corresponding mapped value
    const questionnaireTypeMapping = {
      [QuestionnaireType.FOR_EMPLOYEES]: 'Pour Employées',
      [QuestionnaireType.FOR_CANDIDATES]: 'Pour candidats',
    };
  
    const experienceLevelMapping = {
      [ExperienceLevel.JUNIOR]: 'Junior',
      [ExperienceLevel.MID_LEVEL]: 'Confirmé',
      [ExperienceLevel.SENIOR]: 'Senior',
      [ExperienceLevel.EXPERT]: 'Expert',
    };
  
    return questionnaireTypeMapping[value] || experienceLevelMapping[value] || '';
  }


  toggleInput1() {
    this.showInput1 = !this.showInput1;
  }
  
  toggleInput2() {
    this.showInput2 = !this.showInput2;
  }
  
  toggleInput3() {
    this.showInput3 = !this.showInput3;
  }
  
  getQuestionsType() {
    this.crudService.getQuestionTypeId(this.id).subscribe((data: any) => {
      this.questionType = data;
    });
  }
}
