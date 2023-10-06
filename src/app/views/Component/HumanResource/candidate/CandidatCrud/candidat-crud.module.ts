import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "app/shared/shared.module";
import { CandidatRoutes } from "./candidat-crud.routing";
import { CrudService } from "./candidat-crud.service";
import { CandidatCrudTableComponent } from "./CandidatCrud-table/candidat-crud-table.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTabsModule } from "@angular/material/tabs";
import { Ng2TelInputModule } from "ng2-tel-input";
import { CandidatDetailComponent } from "./Candidat-details/candidat-details.component";
import { NgxPaginationModule } from "ngx-pagination";
import { updateCandidatService } from "../updateCandidat/updateCandidat.service";
import { ViewAllInterviewsDetailsComponent } from "./Candidat-details/viewAll-Interviews/viewAll-Interviews.Detailscomponent";
import { entretienRecrutmentService } from "../../entretienRecrutment/entretienRecrutment.service";
import { ConvertToResourceComponent } from "./convert-candidate/convertToResource.component";


@NgModule({
  imports: [
    
    CommonModule,
    NgxPaginationModule,
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
    MatTabsModule,
    RouterModule.forChild(CandidatRoutes)
  ],
  declarations: [CandidatCrudTableComponent,  CandidatDetailComponent,ViewAllInterviewsDetailsComponent,ConvertToResourceComponent],
  providers: [CrudService,updateCandidatService,entretienRecrutmentService]
})
export class CandidatCrudModule { }
