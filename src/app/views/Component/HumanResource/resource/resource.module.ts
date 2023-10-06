
import { ResourceRoutes } from './resource.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceComponent } from './resourceManagement/resource/resource.component';
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
import { ExternalComponent } from './resourceManagement/external/external.component';
import { ViewResourceComponent } from './view-resource/view-resource.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { UpdateResourceComponent } from './update-resource/update-resource.component';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { ResourceService } from './resource.service';
import { AvailabilityComponent } from './availability/availability.component';
import { UpdateAvailabilityComponent } from './update-availability/update-availability.component';
import { ViewAvailabilityComponent } from './view-availability/view-availability.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SuperiorHierarchiqueComponent } from './superior-hierarchique/superior-hierarchique.component';



@NgModule({
  declarations: [
    ResourceComponent,
    ExternalComponent,
    ViewResourceComponent,
    UpdateResourceComponent,
    AvailabilityComponent,
    UpdateAvailabilityComponent,
    ViewAvailabilityComponent,
    SuperiorHierarchiqueComponent,
    
   
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers : [ResourceService],
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
    MatTabsModule,
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
    MatDatepickerModule,
    MatExpansionModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    RouterModule.forChild(ResourceRoutes)
  ]
})
export class ResourceModule { }
