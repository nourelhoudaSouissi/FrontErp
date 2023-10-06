
import { Routes } from '@angular/router';
import { ListeContractComponent } from './liste-contract-employee/liste-contract.component';
import { AddContractEmployeeComponent } from './add-contract-employee/add-contract-employee.component';
import { ViewContractComponent } from './view-contract/view-contract.component';
import { UpdateContractComponent } from './update-contract/update-contract.component';


export const ContractEmployeeRoutes: Routes = [
  { 
    path: 'liste-employee-contracts', 
    component: ListeContractComponent , 
    data: { title: 'Contrats Employées', breadcrumb: 'Liste des contrats Employées' } 
  },
  { 
    path: 'add-employee-contract', 
    component: AddContractEmployeeComponent , 
    data: { title: 'Ajouter Contrat Employé', breadcrumb: 'Ajouter Contrat Employé' } 
  },
  {
    path: "update-employee-contract",
    component:UpdateContractComponent ,
    data: { title: 'Modifier Contrat Employé', breadcrumb: 'Modifier Contrat Employé' } 
  },
  {
    path: ":id",
    component:ViewContractComponent ,
    pathMatch: "full"
  }
];
