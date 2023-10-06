
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { crudEntretien } from '../crud_entretienRecrutment.routing';
import { crudEntretienRecrutmentComponent } from './crud_entretienRecrutment.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { entretienRecrutmentService } from '../entretienRecrutment.service';
import { evaluationPopupComponent } from '../evaluationnPopup/evaluation-popup.component';
import { ViewAllInterviewsComponent } from './viewAll-Interviews/viewAll-Interviews.component';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
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
    crudEntretienRecrutmentComponent,evaluationPopupComponent,ViewAllInterviewsComponent],
})

export class CrudEntretienRecrutmentModule { }
