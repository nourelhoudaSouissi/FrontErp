import { Component } from '@angular/core';
import { cvcandidatComponent } from './../CvCandidat/cv-candidat.component';
import { CandidatCrudTableComponent } from './CandidatCrud-table/candidat-crud-table.component';
import { Routes } from '@angular/router';
import { updatecandidatComponent } from '../updateCandidat/updateCandidat.component';
import { id } from 'date-fns/locale';
//import { CvTemplate1Component } from '../CvTemplate1/CvTemplate1.component';
import { CandidatDetailComponent } from './Candidat-details/candidat-details.component';
import { entretienRecrutmentComponent } from '../../entretienRecrutment/affichage_entreteinrecrutment/affichage_entretienRecrutment.component';



export const CandidatRoutes: Routes = [
  { 
    path: 'CandidatCrud-table', 
    component: CandidatCrudTableComponent, 
    data: { title: 'Candidat', breadcrumb: 'Liste des candidats' } 
    
  },

  {
    path:'cvCandidat-crud',
    component:cvcandidatComponent,
    data: { title: 'CV Candidat' ,breadcrumb: 'Liste des cv candidats' } 

  },
  {
    path:'updateCandidat/:id',
    component:updatecandidatComponent,
    data:{title: 'Modifier le candidat',breadcrumb: 'Modifier le candidat' }
  },

  { 
    path: ":id", 
   component: CandidatDetailComponent, 
   pathMatch: "full",
   data: { title: 'Candidat', breadcrumb: 'Détails du candidat' } 
  },

  { 
    path: 'evaluationCandidat', 
component: entretienRecrutmentComponent, 
data: { title: 'EntretienRecrutment' } },

{ 
  path: ":id", 
 component: entretienRecrutmentComponent, 
 pathMatch: "full"
 //data: { title: 'AffichageCandidat' }
},

/*{ 
  path: ":templateDuCv", 
 component: templateDuCvComponent, 
 pathMatch: "full"
 //data: { title: 'AffichageCandidat' }
}*/
];
