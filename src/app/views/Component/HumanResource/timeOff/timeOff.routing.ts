import { CrudTimeOffTableComponent } from './crud-ngx-table/crudTimeOff-table.component';
import { Routes } from '@angular/router';


export const CrudsTimeOffRoutes: Routes = [
  { 
    path: 'time-off-crud', 
    component: CrudTimeOffTableComponent, 
    data: { title: 'TimeOff', breadcrumb: 'TimeOff' } 
  }
];