import { AddResourceExternalComponent } from './add-resource-external/add-resource-external.component';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { Routes } from '@angular/router';
import { AddResourceBackofficeComponent } from './add-resource-backoffice/add-resource-backoffice.component';



export const AddResourceRoutes: Routes = [
  { 
    path: 'add-resource-crud', 
    component: AddResourceComponent, 
    data: { title: 'AddInternalResources', breadcrumb: 'AddInterResource' } 
  },
  { 
    path: 'add-backOffice-crud', 
    component: AddResourceBackofficeComponent, 
    data: { title: 'AddResourcesBackOffice', breadcrumb: 'AddResourceBackOffice' } 
  },
  { 
    path: 'add-external-crud', 
    component: AddResourceExternalComponent, 
    data: { title: 'AddExternalResources', breadcrumb: 'AddExternalResource' } 
  }
  
  
  

];