import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-rendez-vous-pop',
  templateUrl: './rendez-vous-pop.component.html'
})
export class RendezVousPopComponent implements OnInit {
  public itemForm: FormGroup
  private contactId: number

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RendezVousPopComponent>,
    private fb: FormBuilder, 
    private contactService: ContactService
  ) { }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload)
    this.contactId = this.data.contactId
  }

  buildItemForm(item){
    this.itemForm = this.fb.group({
      date: [item.date ||'', Validators.required],
      time: [item.time || '', Validators.required],
      location: [item.time || '', Validators.required],
      duration: [item.duration|| '', Validators.required],
      subject: [item.subject|| '', Validators.required],
      contactNum : [this.data.contactId || null, Validators.required],
    });
    
  }

  submit() {
    console.log(this.itemForm.value) 
    this.dialogRef.close(this.itemForm.value)
  }


}
