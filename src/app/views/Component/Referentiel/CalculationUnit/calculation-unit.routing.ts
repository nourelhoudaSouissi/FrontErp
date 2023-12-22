import { Routes } from '@angular/router';
import { ListCalculationUnitComponent } from './list-calculation-unit/list-calculation-unit.component';




export const CalculationUnitRoutes: Routes = [
  { 
    path: 'calculation-unit-crud', 
    component: ListCalculationUnitComponent, 
    data: { title: 'Liste des Unités', breadcrumb: 'Liste des Unités'} 
  }

];
