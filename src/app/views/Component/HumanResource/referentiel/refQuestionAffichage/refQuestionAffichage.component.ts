import { referentielService } from '../referentiel.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Question } from 'app/shared/models/Question';
import { QuestionCategory } from 'app/shared/models/QuestionCategory';

import { ExperienceLevel } from 'app/shared/models/AssOfferCandidate';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { questionUpdateComponent } from './questionUpdate.component';
import { addQuestionComponent } from './addQuestion/addQuestion.component';


@Component({
    selector: 'refQuestionAffichage',
    templateUrl: './refQuestionAffichage.component.html',
    styleUrls:  ['./refQuestionAffichage.component.scss']
  })



  export class refQuestionAffichageComponent implements OnInit {
    repeatForm: FormGroup;
    public getItemSub: Subscription;
    showInput1 = false;
    ExperienceLevel :string []= Object.values(ExperienceLevel);
    question:Question;
    public displayedColumnsQuestions: any;  



    public dataSourceQuestion: MatTableDataSource<Question> ;
    questionCategory:QuestionCategory;
    selectedFile: File;
    id: number;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    constructor(
      private ref: referentielService,
      private fb: FormBuilder,
      private snack: MatSnackBar,
      private route: ActivatedRoute,
      private confirmService: AppConfirmService,
      private loader: AppLoaderService,
      private service : referentielService,
      public dialog: MatDialog )

      {this.dataSourceQuestion = new MatTableDataSource<Question>([]);

      this.repeatForm= new FormGroup({
        repeatArray: new FormArray([])
      });}
  
     
    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.getQuestions();
        this.getQuestionsCategory();
        this.displayedColumnsQuestions = this.getQuestionDisplayedColumns();
    }


    getQuestionDisplayedColumns() {
      return ['question',  'actions'];
    }


    deleteQuestion(row) {
      this.confirmService.confirm({message: `Delete ${row.name}?`})
        .subscribe(res => {
          if (res) {
            this.loader.open('Supprssion de l`offre');
            this.ref.deleteQuestion(row)
              .subscribe((data:any)=> {
                this.dataSourceQuestion = data;
                this.loader.close();
                this.snack.open('Offre supprimée!', 'OK', { duration: 2000 });
                this.getQuestions();
              })
          }
        })
    }
    
    getQuestions() {
      this.getItemSub =this.ref.getQuestionsById(this.id).subscribe((data:any)  => {
        this.dataSourceQuestion = new MatTableDataSource(data);
        this.dataSourceQuestion.paginator = this.paginator;
        this.dataSourceQuestion.sort = this.sort;
      })
          console.log(this.question);
        }
     

      getQuestionsCategory() {
        this.ref.getQuestionCategoryId(this.id).subscribe((data: any) => {
          this.questionCategory = data;
        });
      }
    
     
      ExperienceLevelMap={
        [ExperienceLevel.JUNIOR]:'Junior',
        [ExperienceLevel.MID_LEVEL]:'Confirmé',
        [ExperienceLevel.SENIOR]:'Senior',
        [ExperienceLevel.EXPERT]:'Expert', }

        selectedQuestionId: number;

      
       openUpdateQuestionDialog(row: any): void {
          const dialogRef = this.dialog.open(questionUpdateComponent, {
            data: { row }
          });
        
          dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
              const updatedQuestion = result.question;
        
              // Call the updateQuestion() method from your service
              this.ref.updateQuestion(row.id, { question: updatedQuestion }).subscribe(
                (res) => {
                  console.log(`Question mise à jour avec succés`, res);
                  // Perform any additional actions upon successful update
                },
                (error) => {
                  console.error('Erreur lors de la mise à jour de la question', error);
                  // Handle the error case
                }
              );
            }
          });
        }

        AddQuestion(): void {
          const dialogRef = this.dialog.open(addQuestionComponent, {
            data: { QCid: this.questionCategory.id },
          });
        
          dialogRef.afterClosed().subscribe((result: any) => {
            this.snack.open('Questions ajoutées avec succès!', 'OK', { duration: 2000 });
            this.getQuestions();
          });
        }
        
      
        toggleInput1() {
          this.showInput1 = !this.showInput1;
        }


        applyFilter(event :Event){
          const FilterValue = (event.target as HTMLInputElement).value ;
           this.dataSourceQuestion.filter = FilterValue.trim().toLowerCase();
       
       }
}
