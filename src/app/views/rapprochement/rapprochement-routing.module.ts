import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRapprochementComponent } from './list-rapprochement/list-rapprochement.component';
import { PopUpRapprochementComponent } from './pop-up-rapprochement/pop-up-rapprochement.component';
import { ViewRapprochementComponent } from './view-rapprochement/view-rapprochement.component';

export const RapprochementRoutes: Routes = [

  {
    path: "list",
    component: ListRapprochementComponent,
  },
  {
    path: "ajouter",
    component: PopUpRapprochementComponent,
  },
  {
    path: "rapprochement",
    component: ViewRapprochementComponent,
  },
];


export class RapprochementRoutingModule { }
