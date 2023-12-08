import { Routes } from '@angular/router';
import { ListPaymentTermComponent } from './list-payment-term/list-payment-term.component';




export const PaymentTermRoutes: Routes = [
  { 
    path: 'payment-term-crud', 
    component: ListPaymentTermComponent, 
    data: { title: 'Liste des condition de payment', breadcrumb: 'Liste des condition de payment'} 
  }

];
