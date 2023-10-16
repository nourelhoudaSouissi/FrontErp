
import { Routes } from '@angular/router';
import { ListeContractComponent } from './liste-contract-client/liste-contract.component';
import { AddContractClientComponent } from './add-contract-client/add-contract-client.component';
import { ViewContractClientComponent } from './view-contract-client/view-contract-client.component';
import { UpdateContractComponent } from './update-contract/update-contract.component';



export const ContractClientRoutes: Routes = [
  { 
    path: 'liste-client-contracts', 
    component: ListeContractComponent , 
    data: { title: 'Contrats partenaires', breadcrumb: 'Liste des contrats partenaires' } 
  }, 
  { 
    path: 'add-client-contract', 
    component: AddContractClientComponent , 
    data: { title: 'Ajouter Contrat', breadcrumb: 'Nouveau Contrat' } ,
    pathMatch: "full"
  },
  {
    path: "update-client-contract",
    component:UpdateContractComponent ,
    data: { title: 'Modifier Contrat Partenaire', breadcrumb: 'Modifier Contrat Partenaire' } ,
    pathMatch: "full"
  },
  {
    path: ":id",
    component: ViewContractClientComponent,
    pathMatch: "full"
  }

];
