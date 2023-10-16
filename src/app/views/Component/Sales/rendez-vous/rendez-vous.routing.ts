import { Routes } from '@angular/router';
import { RendezVouslistComponent } from './rendez-vous-list/rendez-vous.component';
import { RendezVousPopupComponent } from './rendez-vous-popup/rendez-vous-popup.component';



export const RendezVousRoutes: Routes = [
  { 
    path: 'rendezVous', 
    component:  RendezVouslistComponent, 
    data: { title: 'Table', breadcrumb: 'Liste des rendez-vous' } 
  },
  {
    path: ":iiid",
    component: RendezVousPopupComponent ,
    pathMatch: "full"
  }
];