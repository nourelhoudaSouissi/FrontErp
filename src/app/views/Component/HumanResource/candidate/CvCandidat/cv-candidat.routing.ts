import { Routes } from '@angular/router';

import { cvcandidatComponent } from './cv-candidat.component';
import { CandidatCrudTableComponent } from '../CandidatCrud/CandidatCrud-table/candidat-crud-table.component';

export const CalendarRoutes: Routes = [{ 
    path: 'cvCandidat-crud', 
component: cvcandidatComponent, 
data: { title: 'Candidat', breadcrumb: 'Ajouter un candidat' } },

{ path: 'CandidatCrud-table', 
    component: CandidatCrudTableComponent, 
    data: { title: 'Table', breadcrumb: 'Table' } 
  },
];
