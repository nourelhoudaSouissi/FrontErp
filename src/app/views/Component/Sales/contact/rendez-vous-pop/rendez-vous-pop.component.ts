import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContactService } from '../contact.service';
import { AppointmentType, RendezVous } from 'app/shared/models/rendez-vous';
import { contact } from 'app/shared/models/contact';

@Component({
  selector: 'app-rendez-vous-pop',
  templateUrl: './rendez-vous-pop.component.html'
})
export class RendezVousPopComponent implements OnInit {
  public itemForm: FormGroup
  private contactId: number

  appointmentType = Object.values(AppointmentType)
  listcontact : contact [] =[];
  isNew: boolean;
  rendezVous : RendezVous 
  contactSelect : contact
  showMobilePhoneNumber = false;
  showEmail = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RendezVousPopComponent>,
    private fb: FormBuilder, 
    private contactService: ContactService
  ) { }

  ngOnInit(): void {
    this.isNew = this.data.isNew 
    this.buildItemForm(this.data.payload)
    this.contactId = this.data.contactId
  }

  buildItemForm(item,contact?: any){
    this.itemForm = this.fb.group({
      date: [item.date ||'', Validators.required],
      time: [item.time || '', Validators.required],
      location: [item.location || '', Validators.required],
      duration: [item.duration|| '', Validators.required],
      subject: [item.subject|| '', Validators.required],
      noteBefore : [item.noteBefore|| '', Validators.required],
     noteAfter : [item.noteAfter|| '', Validators.required],
     appointmentType : [item.appointmentType|| '', Validators.required],
     contactNum : [this.data.contactId || null, Validators.required],
     contactPhone: [{ value: '', disabled: true }],
     contactEmail: [{ value: '', disabled: true }],
    });
    if (contact) {
      this.loadContactDetails(contact, 'contactPhone');
    }
    this.itemForm.get('contactNum').valueChanges.subscribe((contactId) => {
      const selectedContact = this.listcontact.find((c) => c.contactId === contactId);
      if (selectedContact) {
        const selectedContactId = selectedContact.contactId; // Extract contactId from selectedContact
        this.loadContactDetails(selectedContactId, 'contactPhone'); // Pass the contactId to loadContactDetails
      }
    });
  }

  submit() {
    console.log(this.itemForm.value) 
    this.dialogRef.close(this.itemForm.value)
  }

  appointmentTypeMap = {
    [AppointmentType.FACE_TO_FACE]:'Présentiel',
    [AppointmentType.PHONE_CALL]:'Téléphone',
    [AppointmentType.VISIO_CONFERENCE]:'Visioconférence',

  };  

  
  onAppontmentTypeChange(event: any) {
    const selectedAppointmentType = event.value;
  
    if (selectedAppointmentType === AppointmentType.PHONE_CALL) {
      this.showMobilePhoneNumber = true;
      this.showEmail = false;
      this.loadContactDetails(this.contactId, 'contactPhone'); // Load contactPhone based on contactId
    } else if (selectedAppointmentType === AppointmentType.VISIO_CONFERENCE) {
      this.showMobilePhoneNumber = false;
      this.showEmail = true;
      this.loadContactDetails(this.contactId, 'contactEmail'); // Load contactEmail based on contactId
    } else {
      this.showMobilePhoneNumber = false;
      this.showEmail = false;
    }
  }
  
  loadContactDetails(contactId: number, fieldToUpdate: string) {
    this.contactService.getItem(contactId).subscribe((res: contact) => {
      if (fieldToUpdate === 'contactPhone') {
        this.itemForm.get('contactPhone').setValue(res.mobilePhoneNumber);
      } else if (fieldToUpdate === 'contactEmail') {
        this.itemForm.get('contactEmail').setValue(res.email);
      }
    });
  }
  

}
