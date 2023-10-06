import { Routes } from '@angular/router';
import { ListTimeOffValidationComponent } from './list-time-off-validation/list-time-off-validation.component';
import { ViewTimeOffValidationComponent } from './view-time-off-validation/view-time-off-validation.component';



export const TimeOffValidationRoutes: Routes = [
  { 
    path: 'timeOffValidation-crud', 
    component: ListTimeOffValidationComponent, 
    data: { title: 'Validation des demandes de congés', breadcrumb: 'Validation des demandes de congés' } 
  },
  {
    path: ":iiid",
    component: ViewTimeOffValidationComponent ,
    pathMatch: "full",
    data: { title: 'Détails demande de congés', breadcrumb: 'Détails  demande de congés' } 
  }


];
