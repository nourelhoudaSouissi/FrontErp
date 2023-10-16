import { Routes } from '@angular/router';
import { CrudNgxTableComponent } from './crud-ngx-table/crud-ngx-table.component';
import { DetailCrudComponent } from './crud-detail/detail-crud/detail-crud.component';
import { RequirementDetailsComponent } from './requirements-details/requirements-details.component';
import { ContactsDetailsComponent } from './crud-ngx-table/contacts-details/contacts-details.component';
import { PartnerStepperComponent } from './partner-stepper/partner-stepper.component';

export const CrudsRoutes: Routes = [
  { 
    path: 'partner-crud', 
    component: CrudNgxTableComponent, 
    data: { title: 'Table', breadcrumb: 'Liste des prospects-partenaires' } 
  },
  {
    path: "add",
    component:PartnerStepperComponent ,
    pathMatch: "full"
  },
  {
    path: ":iiid",
    component:DetailCrudComponent ,
    pathMatch: "full"
  },
  {
    path: "besoins/:iiid",
    component:RequirementDetailsComponent ,
    pathMatch: "full"
  },
  {
    path: "contacts/:iiid",
    component:ContactsDetailsComponent ,
    pathMatch: "full"
  },

];