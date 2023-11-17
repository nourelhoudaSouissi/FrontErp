import { Routes } from '@angular/router';
import { RendezVouslistComponent } from './rendez-vous-list/rendez-vous.component';
import { RendezVousPopupComponent } from './rendez-vous-popup/rendez-vous-popup.component';
import { ViewRendezVousComponent } from './view-rendez-vous/view-rendez-vous.component';



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
  },
  { 
    path: 'viewRendezVous', 
    component: ViewRendezVousComponent, 
   
  }
];