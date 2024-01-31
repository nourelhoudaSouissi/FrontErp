import { Routes } from '@angular/router';
import { ListProfileComponent } from './list-profile/list-profile.component';



export const ProfileRoutes: Routes = [
  { 
    path: 'profile-crud', 
    component: ListProfileComponent, 
    data: { title: 'Liste des profiles', breadcrumb: 'Liste des profiles'} 
  }

];
