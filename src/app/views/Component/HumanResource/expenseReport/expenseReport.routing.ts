import { Routes } from '@angular/router';
import { ListExpenseReportComponent } from './list-expense-report/list-expense-report.component';
import { ViewExpenseReportComponent } from './view-expense-report/view-expense-report.component';



export const ExpenseReportRoutes: Routes = [
  { 
    path: 'expenseReport-crud', 
    component: ListExpenseReportComponent, 
    data: { title: 'Liste des notes de frais', breadcrumb: 'Liste des notes de frais' } 
  },
{
    path: ":iiid",
    component: ViewExpenseReportComponent ,
    pathMatch: "full",
    data: { title: 'Demanade de note de frais', breadcrumb: 'Demanade de note de frais' } 
  }
];
