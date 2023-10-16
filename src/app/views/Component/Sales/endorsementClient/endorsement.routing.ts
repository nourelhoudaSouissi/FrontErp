import { Component } from '@angular/core';

import { Routes } from '@angular/router';
import { EndorsementListComponent } from './endorsement-list/endorsement-list.component';
import { ViewEndorsementComponent } from './view-endorsement/view-endorsement.component';





export const EndorsementRoutes: Routes = [
  { 
    path: 'endorsement-crud', 
    component: EndorsementListComponent, 
    data: { title: 'Liste des Avenants', breadcrumb: 'Liste des Avenants' } 
  },
  {
    path: ":id",
    component:ViewEndorsementComponent ,
    pathMatch: "full"
  }
  


]
