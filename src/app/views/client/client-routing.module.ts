import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceClientListComponent } from './invoice-client-list/invoice-client-list.component';
import { InvoiceClientDetailComponent } from './invoice-client-detail/invoice-client-detail.component';

export const ClientRoutes: Routes = [
  {
    path: "list",
    component: InvoiceClientListComponent,
  },
  {
    path: "add",
    component: InvoiceClientDetailComponent,
    pathMatch: "full"
  },
  {
    path: ":id",
    component: InvoiceClientDetailComponent,
    pathMatch: "full"
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(ClientRoutes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
