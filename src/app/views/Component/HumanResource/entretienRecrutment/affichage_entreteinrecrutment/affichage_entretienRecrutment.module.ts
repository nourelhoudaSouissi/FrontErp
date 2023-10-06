import { NgApexchartsModule } from 'ng-apexcharts';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ColorPickerModule } from 'ngx-color-picker';
import {  MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { entretienRecrutmentComponent } from './affichage_entretienRecrutment.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { crudEntretien } from '../crud_entretienRecrutment.routing';
import { entretienRecrutmentService } from '../entretienRecrutment.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { questionnairePopupComponent } from './questionnaire-popup/questionnaire-popup.component';
import { ajoutEntretienPopupComponent } from './add-entretien-pop/addEntretien-popup.component';
import { InterviewDetailsDialogComponent } from './interviewDetails/interviewDetails-popup.component';
import { addAdminstrativeDataComponent } from './add-AdsministrativeData-popup/addAdministartiveData-popup.component';
import { MatSliderModule } from '@angular/material/slider';
import { HalfCircleDashboardComponent } from './GlobalAppDash/globalAppDash.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViewAdministrativeDataComponent } from './viewAdministartiveData/viewAdministrativeData.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatSliderModule,
    MatTabsModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
    MatRadioModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FlexLayoutModule,
    ColorPickerModule,
    MatTabsModule,
    NgApexchartsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),

    RouterModule.forChild(crudEntretien)
  ],

  providers: [entretienRecrutmentService],
  // entryComponents: [CalendarFormDialogComponent],
  declarations: [
    entretienRecrutmentComponent,questionnairePopupComponent,ajoutEntretienPopupComponent,InterviewDetailsDialogComponent,
    addAdminstrativeDataComponent,ViewAdministrativeDataComponent,HalfCircleDashboardComponent]
})
export class EntretienRecrutmentModule { }
