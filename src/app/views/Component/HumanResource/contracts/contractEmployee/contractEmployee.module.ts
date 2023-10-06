
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "app/shared/shared.module";
import { Ng2TelInputModule } from "ng2-tel-input";
import { ContractEmployeeRoutes } from "./contractEmployee.routing";
import { ListeContractComponent } from "./liste-contract-employee/liste-contract.component";
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { NgChartsModule } from "ng2-charts";
import { FileUploadModule } from "ng2-file-upload";
import { SharedPipesModule } from "app/shared/pipes/shared-pipes.module";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTreeModule } from "@angular/material/tree";
import { QuillModule } from "ngx-quill";
import { BrowserModule } from "@angular/platform-browser";
import { AddContractEmployeeComponent } from "./add-contract-employee/add-contract-employee.component";
import { ViewContractComponent } from './view-contract/view-contract.component';
import { UpdateContractComponent } from './update-contract/update-contract.component';





@NgModule({
 

  declarations: [
   
    ListeContractComponent,
    AddContractEmployeeComponent,
    ViewContractComponent,
    UpdateContractComponent
   
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
    MatDatepickerModule,
    MatExpansionModule,
    MatGridListModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatProgressBarModule,
    NgChartsModule,
    FileUploadModule,
    SharedPipesModule,
    MatStepperModule,
    MatButtonModule,
    MatTreeModule,
    QuillModule.forRoot(),
    
    
        RouterModule.forChild(ContractEmployeeRoutes)
  ]
})
export class ContractEmployeeModule { }
