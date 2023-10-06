import { Routes } from '@angular/router';
import { ListWeekendComponent } from './list-weekend/list-weekend.component';



export const WeekendRoutes: Routes = [
  { 
    path: 'weekend-crud', 
    component: ListWeekendComponent, 
    data: { title: 'Liste des Weekends', breadcrumb: 'Liste des Weekends'} 
  }

];
