import { Routes } from '@angular/router';
import { CrudClientReviewNgxTableComponent } from './crud-ngx-table/crud-ngx-table-client-review.component';

export const CrudsClientReviewRoutes: Routes = [
  { 
    path: 'client-review-crud', 
    component: CrudClientReviewNgxTableComponent, 
    data: { title: 'Client Review', breadcrumb: 'Client Reviews' } 
  }
];