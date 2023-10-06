import { Routes } from "@angular/router";
import { ConvertToResourceComponent } from "./convertToResource.component";

export const convertRoutes: Routes = [
  { 
    path: ':id', 
    component: ConvertToResourceComponent, 
    data: { title: 'convert', breadcrumb: 'Candidat' } 

  }
];
