import { Routes } from '@angular/router';
import { ListCalendarComponent } from './list-calendar/list-calendar.component';
import { ViewCalendarComponent } from './view-calendar/view-calendar.component';



export const CalendarRoutes: Routes = [
  { 
    path: 'calendar-crud', 
    component: ListCalendarComponent, 
    data: { title: 'Liste des Calendriers Entreprise', breadcrumb: 'Liste des Calendriers Entreprise' } 
  },
  {
    path: ":iiid",
    component: ViewCalendarComponent ,
    pathMatch: "full"
  }


 
];
