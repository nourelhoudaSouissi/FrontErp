import { contract } from 'app/shared/models/contract';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArticleService } from 'app/views/Component/HumanResource/contracts/contractEmployee/article.service';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit {

  contracts: contract[] = [];
  
  formErrorMessages = {
    articleTitle: 'Le titre d\'article est requis',
    description: "La description   est requise",
   

  };
  public itemForm: UntypedFormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateArticleComponent>,
    private fb: UntypedFormBuilder,
    private articleService : ArticleService
  ) { }


  
  ngOnInit() {
    
    this.buildItemForm(this.data.payload);
    this.loadContracts();
  }


  buildItemForm(item) {
    this.itemForm = this.fb.group({
      articleTitle: [item.articleTitle || '', Validators.required],
      description: [item.description ||'',Validators.required]
    })
  }

 
loadContracts(){
  this.articleService.getItems().subscribe((data: contract[]) => {
    this.contracts = data;
    console.log("Contracts data", data);
  });
}

submit() {
  if (this.itemForm.valid) {
    this.dialogRef.close(this.itemForm.value);
  } else {
    // Mark all the form controls as touched to display the validation messages
    this.markFormGroupTouched(this.itemForm);
  }
}

private markFormGroupTouched(formGroup: FormGroup) {
  // Recursively mark all form controls as touched to trigger the validation
  Object.values(formGroup.controls).forEach(control => {
    if (control instanceof FormGroup) {
      this.markFormGroupTouched(control);
    } else {
      control.markAsTouched();
    }
  });
}

}
