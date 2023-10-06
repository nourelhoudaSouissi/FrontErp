import { Routes } from '@angular/router';
import { CrudNgxTableComponent } from './crud-ngx-table/crud-ngx-table.component';
import { DetailCrudComponent } from './crud-detail/detail-crud/detail-crud.component';

export const CrudsRoutes: Routes = [
  { 
    path: 'partner-crud', 
    component: CrudNgxTableComponent, 
    data: { title: 'Table', breadcrumb: 'Table' } 
  },
  {
    path: ":id",
    component:DetailCrudComponent ,
    pathMatch: "full"
  }
];