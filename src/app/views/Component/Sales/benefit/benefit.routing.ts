import { Routes } from "@angular/router";
import { BenefitListComponent } from "../benefit/benefit-list/benefit-list.component";
import { BenefitDetailComponent } from "./benefit-detail/benefit-detail.component";

export const BenefitRoutes: Routes = [
    { 
      path: 'benefit-list', 
      component: BenefitListComponent, 
      data: { title: '', breadcrumb: 'Table' }
    },
    {
      path: ":iiid",
      component: BenefitDetailComponent ,
      pathMatch: "full"
    }
  ];