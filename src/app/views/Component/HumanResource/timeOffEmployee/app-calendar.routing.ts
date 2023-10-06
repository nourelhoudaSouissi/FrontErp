import { Routes } from '@angular/router';

import {  TimeOffCalendarComponent } from './app-calendar.component';

export const CalendarRoutes: Routes = [{
     path: 'timeOffEmployee-crud', 
     component: TimeOffCalendarComponent, 
     data: { 
        title: 'Calendar' 
    } 
}];
