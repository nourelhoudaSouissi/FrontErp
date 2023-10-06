import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Question } from 'app/shared/models/Question';
import { referentielService } from '../referentiel.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    selector: 'questionUpdate',
    templateUrl: 'questionUpdate.component.html',
  })


  export class questionUpdateComponent {
    
    questionForm:FormGroup;
    updatedQuestion: string;

  constructor(
    public dialogRef: MatDialogRef<questionUpdateComponent>,
    private ref: referentielService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar )

  { //this.updatedQuestion = data.question; 
    this.questionForm = this.formBuilder.group({
      question: ['']
    });
    }

    ngOnInit() {
      const questionId = this.data.row.id; // Access the question ID from the passed data
      
      // Additional initialization code if needed
    }


  onCancel(): void {
    this.dialogRef.close();
  }
  submit() {
    this.dialogRef.close(this.questionForm.value)
  }
  
 /* onUpdate(): void {
    this.dialogRef.close(this.updatedQuestion);
  }

  onUpdate(): void {
    this.questionForm = new UntypedFormGroup({
      question: new UntypedFormControl(this.updatedQuestion, [Validators.required]),
    });
  
    if (this.questionForm.valid) {
      this.dialogRef.close(this.questionForm.value);
    } 
  }*/

  onUpdate() {
    const updatedQuestion = this.questionForm.value;
    const questionId = this.data.id;
  
    this.ref.updateQuestion(questionId, updatedQuestion).subscribe(
      (res) => {
        this.snackBar.open(`Question with ID ${res.Id} updated successfully`, 'Close', {
          duration: 2000
        });
        this.dialogRef.close(); // Close the dialog after successful update
      },
      (error) => {
        this.snackBar.open('Error updating question', 'Close', {
          duration: 2000
        });
        console.error('Error updating question', error);
      }
    );

    this.dialogRef.close({ question: updatedQuestion });
  }
}