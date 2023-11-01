import { InvoiceListComponent } from "./invoice-list/invoice-list.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InvoiceDetailsComponent } from "./invoice-details/invoice-details.component";

export const InvoiceRoutes: Routes = [
  {
    path: "list",
    component: InvoiceListComponent,
    data: { title: 'Facture', breadcrumb: 'Facture' }  
  },
  {
    path: "add",
    component: InvoiceDetailsComponent,
    pathMatch: "full"
  },
  {
    path: ":id",
    component: InvoiceDetailsComponent,
    pathMatch: "full"
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(InvoiceRoutes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {}
