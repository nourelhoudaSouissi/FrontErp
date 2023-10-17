import { CommonModule, DatePipe } from "@angular/common";
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

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTabsModule } from "@angular/material/tabs";
import { Ng2TelInputModule } from "ng2-tel-input";
import { ProjetPopupComponent } from "./add projet/projetPopup/ProjetPopup.component";
import { ProjetRoutes } from "./projet.routing";
import { ProjetComponent } from "./add projet/projet.component";
import { ProjetService } from "./projet.service";
import { ViewProjetComponent } from "./viewProjet/viewProjet.component";
import { AffectationComponent } from "./viewProjet/affectationResource/affecatation.component";
import { KanbanBoardComponent } from "./viewProjet/tasks/KanbanBoard.component";
import { TaskPopupComponent } from "./viewProjet/tasks/taskPopup/taskPopup.component";
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PhaseComponent } from "./add projet/projetPopup/phase.component";
import { TaskViewComponent } from "./viewProjet/tasks/taskPopup/taskView.component";
import { ModifTaskComponent } from "./add projet/modifTaskPopup/modifTask.component";




@NgModule({
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
    MatCheckboxModule,
    MatTabsModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    
    RouterModule.forChild(ProjetRoutes),
  ],
  declarations: [ ProjetComponent , ProjetPopupComponent, ViewProjetComponent, AffectationComponent, KanbanBoardComponent, TaskPopupComponent, PhaseComponent, TaskViewComponent, ModifTaskComponent],
  providers: [ ProjetService,DatePipe]
})
export class ProjetModule { }
