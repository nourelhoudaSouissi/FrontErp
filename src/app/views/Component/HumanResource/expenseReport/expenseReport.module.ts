
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';
import { Ng2TelInputModule } from 'ng2-tel-input';

import { MatGridListModule } from '@angular/material/grid-list';

import { ExpenseReportRoutes } from './expenseReport.routing';

import { QuillModule } from "ngx-quill";
import { MatTabsModule } from '@angular/material/tabs';
import { ListExpenseReportComponent } from './list-expense-report/list-expense-report.component';
import { ViewExpenseReportComponent } from './view-expense-report/view-expense-report.component';
import { CreateExpenseReportComponent } from './create-expense-report/create-expense-report.component';




@NgModule({
  declarations: [
 
    ListExpenseReportComponent,
    ViewExpenseReportComponent,
    CreateExpenseReportComponent
   
  ],
  imports: [
    CommonModule,
  
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    TranslateModule,
    MatSortModule,
    SharedModule,
    MatFormFieldModule,
    FormsModule,
    Ng2TelInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatTabsModule,
    QuillModule.forRoot(),
    RouterModule.forChild(ExpenseReportRoutes)
  ]
})
export class ExpenseReportModule { }
