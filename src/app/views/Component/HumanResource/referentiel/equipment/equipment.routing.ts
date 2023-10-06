import { Routes } from '@angular/router';
import { EquipmentComponent } from './equipment/equipment.component';
import { ViewEquipmentComponent } from './equipment/view-equipment/view-equipment.component';



export const EquipmentRoutes: Routes = [
  { 
    path: 'equipmentRef', 
    component: EquipmentComponent, 
    data: { title: 'Liste des équipements', breadcrumb: 'Liste des équipements' } 
  },{ 
    path: 'view-equipment', 
    component: ViewEquipmentComponent, 

  }
  
 
  
];