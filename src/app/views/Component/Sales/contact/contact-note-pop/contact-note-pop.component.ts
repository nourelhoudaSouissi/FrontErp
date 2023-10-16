import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactService } from '../contact.service';

@Component({
  selector: 'app-contact-note-pop',
  templateUrl: './contact-note-pop.component.html'
})
export class ContactNotePopComponent implements OnInit {
  public itemForm: FormGroup;
  public contactNum: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ContactNotePopComponent>,
    private fb: FormBuilder,
    private contactService: ContactService,
  ) { }

  buildItemForm(item){
    this.itemForm = this.fb.group({
      subject : [item.subject || '', Validators.required],
      note : [item.note || '', Validators.required], 
      contactNum: [this.data.contactId, Validators.required]
     })
    }

  ngOnInit(): void {
    this.contactNum = this.data.contactId;
    this.buildItemForm(this.data.payload)
  }

  submit() {
    this.dialogRef.close(this.itemForm.value)
    this.contactService.getItemNotes(this.contactNum)
  }

}
