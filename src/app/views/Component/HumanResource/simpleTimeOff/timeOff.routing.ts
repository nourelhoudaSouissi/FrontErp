import { Routes } from '@angular/router';
import { ListTimeOffComponent } from './list-time-off/list-time-off.component';
import { ViewTimeOffComponent } from './view-time-off/view-time-off.component';


export const TimeOffRoutes: Routes = [
  { 
    path: 'timeOff-crud', 
    component: ListTimeOffComponent, 
    data: { title: 'Liste des congés', breadcrumb: 'Liste des congés' } 
  },
{
    path: ":iiid",
    component: ViewTimeOffComponent ,
    pathMatch: "full",
    data: { title: 'Demande de congé', breadcrumb: 'Demande de congé' } 
  }
];
