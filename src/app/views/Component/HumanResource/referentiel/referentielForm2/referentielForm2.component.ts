import { ActivatedRoute } from '@angular/router';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { referentielService } from '../referentiel.service';
import { QuestionCategory, QuestionnaireType } from 'app/shared/models/QuestionCategory';
import { ExperienceLevel } from 'app/shared/models/AssOfferCandidate';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'referentiel-crud',
  templateUrl: './referentielForm2.component.html',
  styleUrls:  ['./referentielForm2.component.scss']

})


export class referentielForm2Component implements OnInit {
form:FormGroup;
typeForm:FormGroup;
questionForm:FormGroup;
questionCategory:QuestionCategory;
level = Object.values(ExperienceLevel);
questionnaireType = Object.values(QuestionnaireType);
submitted=false ;
showSecondForm = false;
questionId:number;
selectedQuestionType={ id:null};
selectedCategory= { id:null};


constructor(private refService:referentielService, private fb: FormBuilder,
  private snackBar: MatSnackBar,
  private route: ActivatedRoute){

}

ngOnInit(): void {

  this.form = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    level: new UntypedFormControl('', [Validators.required]),
    questionTypeName: new UntypedFormControl('', [Validators.required]),
    questionnaireType: new UntypedFormControl('', [Validators.required]),
  })

  this.questionForm = this.fb.group({
    value : new FormArray([])
   });
   (this.questionForm.get('value') as FormArray).push(this.fb.group({
    question : new UntypedFormControl('', [Validators.required]),
  }));

}

get getQuestion() {
  return (this.questionForm.get('value') as FormArray).controls;
};


ExperienceLevelMap= {
  [ExperienceLevel.INTERN]:'Stagière',
 [ExperienceLevel.JUNIOR]:'Junior',
 [ExperienceLevel.MID_LEVEL]:'Confirmé',
 [ExperienceLevel.SENIOR]:'Senior',
 [ExperienceLevel.EXPERT]:'Expert',
};

QuestionnaireTypeMap={
  [QuestionnaireType.FOR_EMPLOYEES]:'Pour Employées',
  [QuestionnaireType.FOR_CANDIDATES]:'Pour candidats',
};

saveCatQuestion(): void {
  console.log('Submitting form...');

  // Retrieve the question type ID from the route parameters
  const questionTypeId = this.route.snapshot.paramMap.get('id');

  this.refService.addItem({...this.form.value, questionTypeNum: questionTypeId}).subscribe({
    next: (res) => {
      console.log('Item added successfully', res);
      this.selectedCategory = res;
      console.log('Selected technical file ID:', this.selectedCategory.id);
      console.log('Form value', this.form.value);
      this.submitted = true;
      this.openSnackBar('Domaine ajouté avec succés');
    },
    error: (e) => {
      console.error('Error adding item', e);
      console.log('Form is invalid');
      console.log(this.form.errors);
    }
  });
  this.showSecondForm = true;
}




saveQuestion(i:any): void {

  this.refService.addQuest({...this.questionForm.get('value.'+i).value, categoryNum:this.selectedCategory.id}).subscribe({
    next: (res) => {
      console.log('Item added successfully', res);
     console.log('Form value', this.questionForm);
      this.submitted = true;
      (this.questionForm.get('value') as FormArray).push(this.fb.group({
      question : new UntypedFormControl('', [Validators.required]),
      }));
      this.questionId=res.id
    },
    error: (e) => {
      console.error('Error adding item', e);
      console.log('cv Form is invalid');
      console.log(this.questionForm.errors);
    }
  });
}

///////Snack Bar////
openSnackBar(message: string): void {
  this.snackBar.open(message, 'Close', {
    duration: 3000,
    verticalPosition: 'bottom' 
  });
}
}
