import { Routes } from '@angular/router';
import { ListeServiceComponent } from './liste-service/liste-service.component';



export const ServiceRoutes: Routes = [
  { 
    path: 'service-crud', 
    component: ListeServiceComponent, 
    data: { title: 'Liste des services', breadcrumb: 'Liste des services'} 
  }

];
