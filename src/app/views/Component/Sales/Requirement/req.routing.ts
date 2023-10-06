import { Routes } from '@angular/router';
import { ReqlistComponent } from './req-list/reqlist/reqlist.component';
import { ReqpopComponent } from './req-pop/reqpop/reqpop.component';


export const ReqRoutes: Routes = [
  { 
    path: 'requirement-crud', 
    component: ReqlistComponent, 
    data: { title: '', breadcrumb: 'Table' } 
  },
  {
    path: ":iiid",
    component:ReqpopComponent ,
    pathMatch: "full"
  }
];