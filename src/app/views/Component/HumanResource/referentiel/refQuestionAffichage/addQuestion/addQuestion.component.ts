import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Question } from 'app/shared/models/Question';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { referentielService } from '../../referentiel.service';


@Component({
    selector: 'questionUpdate',
    templateUrl: 'addQuestion.component.html',
  })


  export class addQuestionComponent {
    
    questionForm:FormGroup;
    updatedQuestion: string;
    submitted=false ;
    questionId:number;

  constructor(
    public dialogRef: MatDialogRef<addQuestionComponent>,
    private ref: referentielService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,private fb: FormBuilder, )
    

  { 
    }

    ngOnInit() {
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


  onCancel(): void {
    this.dialogRef.close();
  }

  
  submit() {
    this.dialogRef.close(this.questionForm.value)
  }
  

  saveQuestion(i:any): void {

    this.ref.addQuest({...this.questionForm.get('value.'+i).value, categoryNum:this.data.QCid}).subscribe({
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
  
}