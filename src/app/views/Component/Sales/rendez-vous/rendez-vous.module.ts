import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

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

import { RouterModule } from '@angular/router';
import { CalendarModule, DateAdapter } from 'angular-calendar';
 
import { CrudPartnerService } from '../partner/crudPartner.service';
import { RendezVousService } from './rendez-vous.service';
import { RendezVousPopupComponent } from './rendez-vous-popup/rendez-vous-popup.component';
import { RendezVousRoutes } from './rendez-vous.routing';
import { RendezVouslistComponent } from './rendez-vous-list/rendez-vous.component';

import { ContactService } from '../contact/contact.service';
import { ViewRendezVousComponent } from './view-rendez-vous/view-rendez-vous.component';



@NgModule({
  declarations: [
    RendezVousPopupComponent,
    RendezVouslistComponent,
    ViewRendezVousComponent
    
  ],
  providers: [RendezVousService,ContactService, DatePipe],
  imports: [
    CommonModule,
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
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    CalendarModule,

    RouterModule.forChild(RendezVousRoutes)
  ]
})
export class RendezVousModule { }