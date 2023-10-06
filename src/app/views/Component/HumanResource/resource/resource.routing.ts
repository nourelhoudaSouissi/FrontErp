import { ViewResourceComponent } from './view-resource/view-resource.component';
import { ExternalComponent } from './resourceManagement/external/external.component';
import { ResourceComponent } from './resourceManagement/resource/resource.component';
import { Routes } from '@angular/router';
import { UpdateResourceComponent } from './update-resource/update-resource.component';
import { AvailabilityComponent } from './availability/availability.component';
import { ViewAvailabilityComponent } from './view-availability/view-availability.component';


export const ResourceRoutes: Routes = [
  { 
    path: 'resource-crud', 
    component: ResourceComponent, 
    data: { title: 'Resources', breadcrumb: 'Ressources Internes' } 
  },
  { 
    path: 'externalResource-crud', 
    component: ExternalComponent, 
    data: { title: 'Resources', breadcrumb: 'Ressources Externes' } 
  },
  
  { 
    path: 'update-Resource', 
    component: UpdateResourceComponent, 
    data: { title: 'Modifier Resources', breadcrumb: 'Modifier Ressource' } 
  },

  { 
    path: 'availability', 
    component: AvailabilityComponent, 
   
  },
  { 
    path: 'viewAvailability', 
    component: ViewAvailabilityComponent, 
   
  },
 {
    path: ":id",
    component: ViewResourceComponent ,
    pathMatch: "full",
    data: { title: 'Fiche Ressource', breadcrumb: 'Fiche Ressource' } 
  }
];
