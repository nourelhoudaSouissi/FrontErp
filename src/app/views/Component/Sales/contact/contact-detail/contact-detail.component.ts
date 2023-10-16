import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../contact.service';
import { Civility, contact, Privilege } from 'app/shared/models/contact';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ContactNotePopComponent } from '../contact-note-pop/contact-note-pop.component';
import { RendezVousPopComponent } from '../rendez-vous-pop/rendez-vous-pop.component';
import { ContactNote } from 'app/shared/models/ContactNote';
import { RendezVous } from 'app/shared/models/rendez-vous';
import { RendezVousService } from '../../rendez-vous/rendez-vous.service';
import { CrudPartnerService } from '../../partner/crudPartner.service';
import { Partner } from 'app/shared/models/Partner';
import { CommentPopupComponent } from '../../partner/crud-detail/detail-crud/comment-popup/comment-popup.component';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html'
})
export class ContactDetailComponent implements OnInit {
  id: number
  contact: contact
  partner: Partner
  public dataSource: MatTableDataSource<RendezVous>;
  public dataSource1: MatTableDataSource<ContactNote>;

  public displayedColumns: any;
  public notes: ContactNote[]



  constructor(
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private contactService: ContactService,
    private partnerService: CrudPartnerService
  ) {
    this.dataSource = new MatTableDataSource<RendezVous>([])
    this.dataSource1 = new MatTableDataSource<ContactNote>([])
  }

  getDisplayedColumns(){
    return ['date','time','location','duration','subject','actions']
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.displayedColumns = this.getDisplayedColumns()
    this.getContact();
  }
  
  getContact() {
    this.contactService.getItem(this.id).subscribe((data: any) => {
      this.contact = data;
      console.log(this.contact);
      console.log(this.contact.partnerId)
      this.getContactNotes();
      this.getAppointments();
      this.partnerContact();
      if(this.partnerContact()){
        this.getPartner()
      }
    });
  }

  openComment() {
    this.dialog.open(CommentPopupComponent, {
      data: {comment: this.partner.comment
      },
    });
  }
  
  getPartner() {
    if (this.contact && this.contact.partnerId) {
      this.partnerService.getItem(this.contact.partnerId).subscribe((data: any) => {
        this.partner = data;
        console.log(this.partner);
        console.log(this.partner.name)
      });
    }
  }
  

  getAppointments() {
    
    this.contactService.getItemAppointments(this.id).subscribe((data: any) => {
      {
        this.dataSource = new MatTableDataSource(data);
      }
    })
  }

  getContactNotes() {
    
    this.contactService.getItemNotes(this.id).subscribe((data: any) => {
      {
        this.notes = data;
      }
      
    console.log(this.notes)
    })
  }

  deleteNote(id: number) {
    this.contactService.deleteNote(id)
      .subscribe(
        response => {
          console.log(response);
          // Reload the addresses list after deletion
          this.getContactNotes();
        },
        error => {
          console.log(error);
        }
      );
    }

  deleteAppointment(id: number) {
    this.contactService.deleteAppointment(id)
      .subscribe(
        response => {
          console.log(response);
          // Reload the addresses list after deletion
          this.getAppointments();
        },
        error => {
          console.log(error);
        }
      );
    }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Nouveau rendez-vous' : 'Mettre à jour rendez-vous';
    let dialogRef: MatDialogRef<any> = this.dialog.open(RendezVousPopComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data ,  contactId : this.contact.contactId }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        if (isNew) {
          this.loader.open('Ajout en cours');
          console.log(this.contact.contactId)
          console.log(data.contactId)
          this.contactService.addContactAppointment(res)
            .subscribe((data:any) => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Rendez-vous ajouté avec succès!', 'OK', { duration: 4000 })
              this.getAppointments()
            })
        } else {
          this.loader.open('Mise à jour');
          console.log(data.id)
          console.log(this.contact.contactId)
          this.contactService.updateContactAppointment(data.id, res)
            .subscribe((data :any) => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Rendez-vous mis à jour avec succès!', 'OK', { duration: 4000 })
              this.getAppointments();
            })
        }
      })
  }

  openPopUp1(data: any = {} , isNew?) {
    let title = isNew ? 'Ajouter note contact' : 'Modifier note contact';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ContactNotePopComponent, {
      width: '1000px',
      disableClose: true,
      data: { title: title, payload: data , contactId: this.contact.contactId}
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        if (isNew) {
          this.loader.open('Ajout en cours');
          this.contactService.addContactNote(res)
            .subscribe((data :any)=> {
              this.dataSource1 = data;
              console.log(this.dataSource1)
              this.loader.close();
               this.snack.open('Note contact ajouté avec succès!', 'OK', { duration: 2000 });
               this.getContactNotes()
            })
        }else {
          this.loader.open('modification en cours');
          console.log(data.id)
          this.contactService.updateContactNote(data.id, res)
            .subscribe((data:any) => {
              this.dataSource1 = data ;
              this.loader.close();
              this.snack.open('Note contact modifié avec succès!', 'OK', { duration: 2000 });
              this.getContactNotes();
            })
        } 
      })
  }

  partnerContact(): boolean{
    if(this.contact.partnerId!=null)
    return true
    else 
    return false
  }
  CivilityMap = {
    [Civility.MR]:'Mr',
    [Civility.MRS]:'Mme',
    [Civility.MS] : 'Mlle'
   
  };
  PrivilegeMap = {
    [Privilege.HIGH]:'Elevé',
    [Privilege.MEDIUM]:'Moyen',
    [Privilege.LOW] : 'Faible'
  };
}

