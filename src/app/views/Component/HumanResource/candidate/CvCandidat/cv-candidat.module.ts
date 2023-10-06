import { MatSelectModule } from '@angular/material/select';
import { cvcandidatComponent } from './cv-candidat.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ColorPickerModule } from 'ngx-color-picker';
import { CalendarRoutes } from "./cv-candidat.routing";
import { CalendarFormDialogComponent } from './calendar-form-dialog/calendar-form-dialog.component';
import { CvCandidatService } from './cv-candidat.service';
import { MatStepperModule } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipList, MatChipsModule } from '@angular/material/chips';
import { MatGridList, MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { OfferPopupComponent } from './cv-popups/offerPopup.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  imports: [
    MatDialogModule,
    MatSnackBarModule,
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatStepperModule,
    HttpClientModule,
    MatExpansionModule,
    FormsModule,
    MatGridListModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FlexLayoutModule,
    ColorPickerModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    RouterModule.forChild(CalendarRoutes)
  ],
  exports: [MatDialogModule,MatDialogClose],
  providers: [CvCandidatService,{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { showError: true }
  }],
  // entryComponents: [CalendarFormDialogComponent],
  declarations: [
    cvcandidatComponent, 
    CalendarFormDialogComponent,
    OfferPopupComponent
  ]
})
export class CvCandidatModule { }
