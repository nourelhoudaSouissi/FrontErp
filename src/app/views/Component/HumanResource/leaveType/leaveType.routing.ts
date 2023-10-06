import { Routes } from '@angular/router';
import { ListLeaveTypeComponent } from './list-leave-type/list-leave-type.component';

export const LeaveTypeRoutes: Routes = [
  { 
    path: 'leaveType-crud', 
    component: ListLeaveTypeComponent, 
    data: { title: 'Liste des types de congé', breadcrumb: 'Liste des types de congé' } 
  },
/*{
    path: ":iiid",
    component: ViewResourceComponent ,
    pathMatch: "full"
  }*/

 
];
