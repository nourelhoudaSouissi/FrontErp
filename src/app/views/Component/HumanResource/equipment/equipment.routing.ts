import { Routes } from '@angular/router';
import { EquipmentComponent } from './equipment/equipment.component';
import { ViewEquipmentComponent } from './equipment/view-equipment/view-equipment.component';
import { MotifUnavailabilityComponent } from './equipment/motif-unavailability/motif-unavailability.component';
import { AffectationComponent } from './equipment/affectation/affectation.component';
import { ReturnEquipmentComponent } from './equipment/return-equipment/return-equipment.component';


export const EquipmentRoutes: Routes = [
  { 
    path: 'equipment-crud', 
    component: EquipmentComponent, 
    data: { title: 'Liste des affectations des équipements', breadcrumb: 'Liste des affectations des équipements' } 
  },{ 
    path: 'view-equipment', 
    component: ViewEquipmentComponent, 

  },{
    path: 'motif', 
    component: MotifUnavailabilityComponent, 
 
  },{
    path: 'affectation', 
    component: AffectationComponent, 
 
  },{ 
    path: 'return-equipment', 
    component: ReturnEquipmentComponent,
  },
 
  
];