import { Routes } from '@angular/router';
import { ListTvaCodeComponent } from './list-tva-code/list-tva-code.component';




export const TvaCodeRoutes: Routes = [
  { 
    path: 'tva-code-crud', 
    component: ListTvaCodeComponent, 
    data: { title: 'Liste des code TVA', breadcrumb: 'Liste des code TVA'} 
  }

];
