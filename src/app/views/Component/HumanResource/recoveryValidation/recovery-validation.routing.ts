import { Routes } from '@angular/router';
import { ListRecoveryValidationComponent } from './list-recovery-validation/list-recovery-validation.component';
import { ViewRecoveryValidationComponent } from './view-recovery-validation/view-recovery-validation.component';



export const RecoveryValidationRoutes: Routes = [
  { 
    path: 'recoveryValidation-crud', 
    component: ListRecoveryValidationComponent, 
    data: { title: 'Validation Récupération', breadcrumb: 'Validation Récupération' } 
  },
  
  {
    path: 'view-recoveryLeaveValidation',
    component: ViewRecoveryValidationComponent,
    data: { title: 'Valdation', breadcrumb: 'Validation' }
  }

];
