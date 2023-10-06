import { Routes } from '@angular/router';
import { ConactListComponent } from './conact-list/conact-list/conact-list.component';

export const conactroutes: Routes = [
  { 
    path: 'hh', 
    component: ConactListComponent, 
    data: { title: 'Table', breadcrumb: 'Table' } 
  },

];