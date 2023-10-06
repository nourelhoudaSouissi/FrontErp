import { Routes } from '@angular/router';
import { referentielCrudTableComponent } from './referentielDataTable/referentiel-crud-table.component';
import { referentielFormComponent } from './referentielForm/referentielForm.component';
import { refQuestionAffichageComponent } from './refQuestionAffichage/refQuestionAffichage.component';
import { referentielForm2Component } from './referentielForm2/referentielForm2.component';
import { refCategoryAffichageComponent } from './refCategoryAffichage/refCategoryAffichage.component';


export const referentielRoutes: Routes = [
  
    { 
        path: 'referentielTable', 
        component: referentielCrudTableComponent , 
        data: { title: 'Catégories', breadcrumb: 'Liste des catégories des questionnaires' } 
      },

      { 
        path: 'referentielForm', 
        component: referentielFormComponent , 
        data: { title: 'Formulaire', breadcrumb: 'Création d\'un questionnaire' } 
      },
      { 
        path: ':id', 
        component: referentielForm2Component , 
        data: { title: 'refForm', breadcrumb: 'Ajout d\'un domaine' } 
      },

      { 
        path: 'ref/:id', 
        component: refCategoryAffichageComponent, 
        data: { title: 'Domaines', breadcrumb: 'Liste des domaines des questionnaires' } 
      },

      { 
        path: ':quest/:id', 
        component: refQuestionAffichageComponent , 
        data: { title: 'Questions', breadcrumb: 'Liste des questions d\'un domaine' } 
      }

      
]
