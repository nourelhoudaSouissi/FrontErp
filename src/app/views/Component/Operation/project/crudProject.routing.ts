import { ProjectComponent } from './project.component';
import { Routes } from '@angular/router';


export const CrudProjectRoutes: Routes = [
  { 
    path: 'project_crud', 
    component: ProjectComponent, 
    data: { title: 'Project', breadcrumb: 'Projects' } 
  }
];