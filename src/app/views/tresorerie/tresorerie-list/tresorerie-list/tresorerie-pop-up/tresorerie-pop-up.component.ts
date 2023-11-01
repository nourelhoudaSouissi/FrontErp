import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Caisse, CategoryCaisse } from 'app/shared/models/caisse.model';

@Component({
  selector: 'app-tresorerie-pop-up',
  templateUrl: './tresorerie-pop-up.component.html',
  styleUrls: ['./tresorerie-pop-up.component.scss']
})
export class TresoreriePopUpComponent implements OnInit {

  categoryCaisse: string[] = Object.values(CategoryCaisse);

  isLoading = false;
  decaissement: Caisse ;
  showEditOption = false;
  decaissementForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TresoreriePopUpComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,

  ) {}
  
  ngOnInit() {
    this.buildDecaissementForm(this.data.payload);

  }

  submit() {
    this.dialogRef.close(this.decaissementForm.value);
  }
  
  buildDecaissementForm(decaissement?: Caisse) {
    this.decaissementForm = this.fb.group({
      amount: [decaissement?.amount || null],
      date: [decaissement?.date || ''],
      description: [decaissement?.description || ''],
      categoryCaisse: [decaissement?.categoryCaisse, Validators.required],
     
    });
   
  }
  closeDialog() {
    this.dialog.closeAll();
  }


}


