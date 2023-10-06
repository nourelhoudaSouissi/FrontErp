import { Routes } from '@angular/router';
import { ListHolidayComponent } from './list-holiday/list-holiday.component';


export const HolidayRoutes: Routes = [
  { 
    path: 'holiday-crud', 
    component: ListHolidayComponent, 
    data: { title: 'Liste des jours fériés', breadcrumb: 'Liste des jours fériés' } 
  },
/*{
    path: ":iiid",
    component: ViewResourceComponent ,
    pathMatch: "full"
  }*/

 
];
