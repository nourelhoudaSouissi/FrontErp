import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  Validators,  FormGroup, FormBuilder } from '@angular/forms';
import { Availability,WorkField,RequirementStatus,RequirementType} from 'app/shared/models/req';
import { Partner } from 'app/shared/models/Partner';
import { CrudPartnerService } from '../../partner/crudPartner.service';
import { contact } from 'app/shared/models/contact';
import { ContactService } from '../../contact/contact.service';

@Component({
  selector: 'app-rendezvouspopup',
  templateUrl: './rendez-vous-popup.component.html'
  
})
export class RendezVousPopupComponent implements OnInit {

  public itemForm: FormGroup;
 
  listcontact : contact [] =[];
 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RendezVousPopupComponent>,
    private fb: FormBuilder, 
    private contactService: ContactService
  ) { }



  buildItemForm(item){
    this.itemForm = this.fb.group({
     
      date: [item.date ||'', Validators.required, ],
      time: [item.time|| '', Validators.required],
     duration: [item.duration|| '', Validators.required],
     location: [item.location || '', Validators.required],
     subject: [item.subject|| '', Validators.required],
      contactNum : [item.contactId|| null, Validators.required],
    });
    
  }


  getContacts(){
this.contactService.getItems().subscribe((data :any )=>{
  this.listcontact = data
});

}

  ngOnInit() {
    this.buildItemForm(this.data.payload)
     this.getContacts()

  }

  submit() {
    
    this.dialogRef.close(this.itemForm.value)


  }

  

}