import { Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list/contact-list.component';


export const contactRoutes: Routes = [
  

    {
      path: 'contact-table',
      component: ContactListComponent,
      data: { title: 'Material TAble', breadcrumb: 'Material Table' }
    }
  
];