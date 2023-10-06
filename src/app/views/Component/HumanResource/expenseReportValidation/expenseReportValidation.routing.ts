import { Routes } from '@angular/router';
import { List } from 'echarts';
import { ListExpenseReportValidationComponent } from './list-expense-report-validation/list-expense-report-validation.component';
import { ViewExpenseReportValidationComponent } from './view-expense-report-validation/view-expense-report-validation.component';


export const ExpenseReportValidationRoutes: Routes = [
  { 
    path: 'expenseReportValidation-crud', 
    component: ListExpenseReportValidationComponent, 
    data: { title: 'Validation des notes de frais', breadcrumb: 'Validation des notes de frais' } 
  },
{
    path: ":iiid",
    component: ViewExpenseReportValidationComponent ,
    pathMatch: "full"
  }
];
