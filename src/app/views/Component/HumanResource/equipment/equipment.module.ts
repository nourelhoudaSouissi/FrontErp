import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
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
import { EquipmentRoutes } from "./equipment.routing";
import { EquipmentService } from "./equipment.service";
import { EquipmentComponent } from "./equipment/equipment.component";
import { ViewEquipmentComponent } from './equipment/view-equipment/view-equipment.component';
import { MotifUnavailabilityComponent } from './equipment/motif-unavailability/motif-unavailability.component';
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { AffectationComponent } from './equipment/affectation/affectation.component';
import { ReturnEquipmentComponent } from './equipment/return-equipment/return-equipment.component';



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
    SharedModule,
    MatSelectModule,
    RouterModule.forChild(EquipmentRoutes)
  ],
  declarations: [EquipmentComponent, ViewEquipmentComponent, MotifUnavailabilityComponent, AffectationComponent, ReturnEquipmentComponent],
  providers: [EquipmentService]
})
export class EquipmentModule { }
