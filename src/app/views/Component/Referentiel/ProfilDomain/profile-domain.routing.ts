import { Routes } from '@angular/router';
import { ListProfileDomainComponent } from './list-profile-domain/list-profile-domain.component';




export const ProfileDomainRoutes: Routes = [
  { 
    path: 'profile-domain-crud', 
    component: ListProfileDomainComponent, 
    data: { title: 'Liste des domaines', breadcrumb: 'Liste des domaines'} 
  }

];
