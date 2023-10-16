import { Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list/contact-list.component';
import { ContactNotePopComponent } from './contact-note-pop/contact-note-pop.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { RendezVousPopComponent } from './rendez-vous-pop/rendez-vous-pop.component';


export const contactRoutes: Routes = [
  {
    path: 'contact-list',
    component: ContactListComponent,
    data: { title: 'Table', breadcrumb: 'Liste des contacts' }
  },
  {
    path: ":id",
    component: ContactDetailComponent ,
    pathMatch: "full"
  },
  {
    path: 'contact-appointment',
    component: RendezVousPopComponent,
    pathMatch: "full"  },
  {
    path: 'contact-note',
    component: ContactNotePopComponent,
    pathMatch: "full"  }
]