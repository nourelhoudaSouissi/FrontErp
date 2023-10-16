import { Routes } from '@angular/router';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrdersDetailComponent } from './orders-detail/orders-detail.component';


export const OrdersRoutes: Routes = [
  { 
    path: 'orders-crud', 
    component: OrdersListComponent, 
    data: { title: 'Table', breadcrumb: 'Liste des commandes' } 
  },
  {
    path: "add",
    component: OrdersDetailComponent,
    pathMatch: "full"
  },
  {
    path: ":id",
    component: OrdersDetailComponent ,
    pathMatch: "full"
  }
];