import { UpdatedQuestion } from './../../../../../../shared/models/UpdtaedQuestion';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionCategory } from 'app/shared/models/QuestionCategory';
import { QuestionType } from 'app/shared/models/QuestionType';
import { entretienRecrutmentService } from '../../entretienRecrutment.service';
import { Question } from 'app/shared/models/Question';

@Component({
  selector: 'app-popup',
  templateUrl: './questionnaire-popup.component.html',
  //styleUrls: ['./questionnaire-popup.component.css']
})
export class questionnairePopupComponent {
  questionTypes: QuestionType[];
  UpdatedQuestion :UpdatedQuestion[] ;
  questionTypeIds:number[];
  questionCategories: QuestionCategory[];
  filteredQuestionCategories: QuestionCategory[];
  questions: Question[];
  interviewId: number;
  UpdatedQuestions: UpdatedQuestion[]=[] ;
  selectedQuestionType: QuestionType;
  selectedQuestionCategory: QuestionCategory;
  selectedQuestionCategoryId: number;
  @Output() questionnaireAdded: EventEmitter<number> = new EventEmitter<number>();
  filtersSelected: EventEmitter<any> = new EventEmitter<any>();
  snack: any;

  constructor(
    public dialogRef: MatDialogRef<questionnairePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: entretienRecrutmentService
  ) {
    this.questionTypes = data.questionTypes;
    this.selectedQuestionCategoryId = null; // Reset the selected question category
    this.questionCategories = data.questionCategories;
    this.filteredQuestionCategories = [];
    this.questions = [];
  }

  onQuestionTypeChange(): void {
    this.filteredQuestionCategories = this.questionCategories.filter(
      (category) => category.questionTypeNum === this.selectedQuestionType?.id
    );
  }

 

  applyFilters(): void {
    const filters = {
      questionType: this.selectedQuestionType,
      questionCategory: this.selectedQuestionCategory
    };
    this.filtersSelected.emit(filters);
    this.getQuestions();
  }

  ngOnInit() {
    this.getCategoryTypes();
  }
  refreshPage(): void {
    location.reload();
  }
  getCategoryTypes() {
    this.service.getAllQuestiontypes().subscribe(
      (questionTypes: QuestionType[]) => {
        this.questionTypes = questionTypes;
        this.filterQuestionCategories();
      },
      (error) => {
        console.error('Failed to retrieve question types', error);
      }
    );
  }

  filterQuestionCategories() {
    if (this.selectedQuestionType) {
      this.service.getQuestionCategoriesByType(this.selectedQuestionType.id).subscribe(
        (questionCategories: QuestionCategory[]) => {
          this.filteredQuestionCategories = questionCategories;
          this.selectedQuestionCategory = null; // Reset the selected question category
          this.getQuestions();
        },
        (error) => {
          console.error('Failed to retrieve question categories', error);
        }
      );
    } else {
      this.filteredQuestionCategories = [];
      this.selectedQuestionCategory = null; // Reset the selected question category
      this.getQuestions();
    }
  }
  addQuestionnaire(questionnaire: any): void {
    const updatedQuestions = questionnaire.questions.map((question: any) => ({
      questionText: question.question,
      interviewNum: questionnaire.interviewId
    }));
  
    updatedQuestions.forEach(updatedQuestion => {
      this.service.addUpdatedQuestion(updatedQuestion).subscribe(
        (response) => {
          console.log('Updated question added successfully', response);
          // Add any necessary handling for the response
        },
        (error) => {
          console.error('Error adding updated question', error);
          // Add any necessary error handling
        }
      );
    });
  
    // Find the selected question category based on the selected question type
    const selectedQuestionCategory = this.questionCategories.find(category => category.id === this.selectedQuestionCategory.id);
  
    // Update the interview with the selected question category
    const questionTypeIds: number[] = [this.selectedQuestionType.id];
    this.service.addQuestionTypeToInterview(questionnaire.interviewId, questionTypeIds).subscribe(
      (response) => {
        console.log('Question type added to the interview successfully', response);
  
        // Reset the form and close the popup
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error adding question type to the interview', error);
      }
    );
  }
  
  
  onAddQuestionnaire(questionTypeId: number): void {
    // Create the questionnaire object
    const questionnaire = {
      interviewId: this.data.interviewId,
      questions: this.questions,
      questionType: questionTypeId
    };
    console.log(questionnaire)
    // Call the addQuestionnaire() method
    this.addQuestionnaire(questionnaire);
    this.refreshPage();
  }
  
  createUpdatedQuestionsFromQuestions(questionStrings: string[], interviewId: number): void {
    this.UpdatedQuestions = []; // Reset the array before populating it
  
    questionStrings.forEach(questionString => {
      const updatedQuestion: UpdatedQuestion = {
        questionText: questionString, // Set the questionText to the questionString
        interviewNum: interviewId,
      };
  
      this.service.addUpdatedQuestion(updatedQuestion).subscribe(
        (response) => {
          console.log('Updated question added successfully', response);
          this.UpdatedQuestions.push(response.updatedQuestion); // Add the updated question to the local array
        },
        (error) => {
          console.error('Error adding updated question', error);
        }
      );
    });
  }
  getQuestions(): void {
    if (this.selectedQuestionType && this.selectedQuestionCategory) {
      const typeId = this.selectedQuestionType.id;
      const categoryId = this.selectedQuestionCategory.id;
      console.log(this.selectedQuestionCategory);
      this.service.getQuestionByTypeAndCategory(typeId, categoryId).subscribe(
        (questions: Question[]) => {
          this.questions = questions;
          console.log(this.questions);
        },
        (error) => {
          console.error('Failed to retrieve questions', error);
        }
      );
    } else {
      this.questions = [];
    }}
  
    closeDialog(): void {
      const result = {
        interviewId: this.interviewId  };
      this.dialogRef.close(result);
    }
  
  }