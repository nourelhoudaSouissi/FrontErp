import { Routes } from '@angular/router';
import { ReqlistComponent } from './req-list/reqlist/reqlist.component';
import { ReqpopComponent } from './req-pop/reqpop/reqpop.component';
import { ReqDetailComponent } from './req-detail/req-detail.component';
import { ProfilePopComponent } from './profile-pop/profile-pop.component';


export const ReqRoutes: Routes = [
  { 
    path: 'requirement-crud', 
    component: ReqlistComponent,
    data: { title: 'Table', breadcrumb: 'Liste des opportunités' } 
  },
  {
    path: "",
    component:ReqpopComponent ,
    pathMatch: "full"
  },
  {
    path: "detail/:id",
    component: ReqDetailComponent ,
    pathMatch: "full"
  },
  {
    path: "add/:id",
    component: ProfilePopComponent ,
    pathMatch: "full"
  }
];