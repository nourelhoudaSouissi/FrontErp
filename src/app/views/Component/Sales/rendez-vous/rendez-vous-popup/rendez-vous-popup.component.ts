import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  Validators,  FormGroup, FormBuilder } from '@angular/forms';
import { contact } from 'app/shared/models/contact';
import { ContactService } from '../../contact/contact.service';
import { AppointmentType, RendezVous } from 'app/shared/models/rendez-vous';

@Component({
  selector: 'app-rendezvouspopup',
  templateUrl: './rendez-vous-popup.component.html'
  
})
export class RendezVousPopupComponent implements OnInit {

  public itemForm: FormGroup;
  appointmentType = Object.values(AppointmentType)
  listcontact : contact [] =[];
  isNew: boolean;
  rendezVous : RendezVous 
  contactSelect : contact
  showMobilePhoneNumber = false;
  showEmail = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RendezVousPopupComponent>,
    private fb: FormBuilder, 
    private contactService: ContactService
  ) { }



  buildItemForm(item,contact?: any){
    this.itemForm = this.fb.group({
     
     date: [item.date ||'', Validators.required, ],
     time: [item.time|| '', Validators.required],
     duration: [item.duration|| '', Validators.required],
     location: [item.location || '', Validators.required],
     subject: [item.subject|| '', Validators.required],
     noteBefore : [item.noteBefore|| '', Validators.required],
     noteAfter : [item.noteAfter|| '', Validators.required],
     appointmentType : [item.appointmentType|| '', Validators.required],
     contactNum : [item.contactId|| null, Validators.required],
     //contactPhone : [item.contactId|| null, Validators.required],
     //contactEmail : [item.contactId|| null, Validators.required],
     contactPhone: [{ value: '', disabled: true }],
     contactEmail: [{ value: '', disabled: true }],
    });
    
    if (contact) {
      this.loadContactDetails(contact, 'contactPhone');
    }
  
    this.itemForm.get('contactNum').valueChanges.subscribe((contactId) => {
      const selectedContact = this.listcontact.find((c) => c.contactId === contactId);
      if (selectedContact) {
        this.loadContactDetails(selectedContact, 'contactPhone');
      }
    });
  }

  /*loadContactDetails(contact: any) {
    this.contactService.getItem(contact.contactId).subscribe((res: contact) => {
      this.itemForm.get('contactPhone').setValue(res.mobilePhoneNumber);
      this.itemForm.get('contactEmail').setValue(res.email);
    });

  }*/
  getContacts(){
  this.contactService.getItems().subscribe((data :any )=>{
  this.listcontact = data
});

}

  ngOnInit() { 
    this.isNew = this.data.isNew 
    this.buildItemForm(this.data.payload)
    this.getContacts()


    

  }

  submit() {
    this.dialogRef.close(this.itemForm.value)
  }


  appointmentTypeMap = {
    [AppointmentType.FACE_TO_FACE]:'Présentiel',
    [AppointmentType.PHONE_CALL]:'Téléphone',
    [AppointmentType.VISIO_CONFERENCE]:'Visioconférence',

  };  


/*
  onAppontmentTypeChange(event: any) {
    const selectedAppointmentType = event.value;
  
    if (selectedAppointmentType === AppointmentType.PHONE_CALL) {
      this.showMobilePhoneNumber = true;
      const mobilePhoneNumberToAdd = this.itemForm.get('contactPhone').value;
      this.itemForm.get('contactPhone').setValue(mobilePhoneNumberToAdd);
    } else {
      this.showMobilePhoneNumber = false;
      this.itemForm.get('contactPhone').setValue(null);
    }


    if (selectedAppointmentType === AppointmentType.VISIO_CONFERENCE) {
      this.showEmail = true;
      const emailToAdd = this.itemForm.get('contactEmail').value;
      this.itemForm.get('contactEmail').setValue(emailToAdd);
    } else {
      this.showEmail = false;
      this.itemForm.get('contactEmail').setValue(null);
    }
    
  }*/



  onAppontmentTypeChange(event: any) {
    const selectedAppointmentType = event.value;
  
    if (selectedAppointmentType === AppointmentType.PHONE_CALL) {
      this.showMobilePhoneNumber = true;
      this.showEmail = false;
    } else if (selectedAppointmentType === AppointmentType.VISIO_CONFERENCE) {
      this.showMobilePhoneNumber = false;
      this.showEmail = true;
    } else {
      this.showMobilePhoneNumber = false;
      this.showEmail = false;
    }
  
    // Fetch and set contact details if applicable
    const selectedContactId = this.itemForm.get('contactNum').value;
    const selectedContact = this.listcontact.find((c) => c.contactId === selectedContactId);
  
    if (selectedAppointmentType === AppointmentType.PHONE_CALL && selectedContact) {
      this.loadContactDetails(selectedContact, 'contactPhone');
    } else if (selectedAppointmentType === AppointmentType.VISIO_CONFERENCE && selectedContact) {
      this.loadContactDetails(selectedContact, 'contactEmail');
    }
  }
  
  loadContactDetails(contact: any, fieldToUpdate: string) {
    this.contactService.getItem(contact.contactId).subscribe((res: contact) => {
      if (fieldToUpdate === 'contactPhone') {
        this.itemForm.get('contactPhone').setValue(res.mobilePhoneNumber);
      } else if (fieldToUpdate === 'contactEmail') {
        this.itemForm.get('contactEmail').setValue(res.email);
      }
    });
  }
  
}