import { Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list/contact-list.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { ContactNoteComponent } from './contact-note/contact-note.component';
//import { ContactDetailComponent } from './contact-detail/contact-detail.component';


export const contactRoutes: Routes = [
  {
    path: '',
    children: [
    {
      path: 'contact-table',
      component: ContactListComponent,
      data: { title: '', breadcrumb: 'Material Table' }
    },
    {
      path: 'contact-appointment',
      component: AppointmentComponent,
      data: { title: '', breadcrumb: 'Material Table' }
    },
    {
      path: 'contact-note',
      component: ContactNoteComponent,
      data: { title: '', breadcrumb: 'Material Table' }
    },
    /*{
      path: ":id",
      component: ContactDetailComponent ,
      pathMatch: "full"
    }*/
  ]
  }
];