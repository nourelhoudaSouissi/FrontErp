import { Routes } from '@angular/router';
import { crudEntretienRecrutmentComponent } from './crud_table_entretienRecrutment/crud_entretienRecrutment.component';
import { crudEvaluationComponent } from './add_evaluation/add_crud_evaluation.component';
import { entretienRecrutmentComponent } from './affichage_entreteinrecrutment/affichage_entretienRecrutment.component';
import { CrudEvaluationModule } from './add_evaluation/add_crud_evaluation.module';




export const crudEntretien: Routes = [{ 
    path: 'tableEntretien', 
component: crudEntretienRecrutmentComponent, 
data: { title: 'Liste des Candidats à évaluer', breadcrumb: 'Liste des Candidats à évaluer' } },
{ 

  path: 'crudEvaluation', 
component: crudEvaluationComponent, 
data: { title: ' Liste des évaluations' , breadcrumb: 'Liste des évaluations' } 
},

{ 
  path: ":id", 
 component: entretienRecrutmentComponent, 
 pathMatch: "full",
// data: { title: 'AffichageCandidat' }
},


/*

{
   path: 'CandidatEvaluation/:id',
 component: crudEvaluationComponent
},*/



];