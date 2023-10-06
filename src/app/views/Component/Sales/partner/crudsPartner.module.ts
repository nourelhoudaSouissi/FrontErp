import { CrudsRoutes } from './crudsPartner.routing';

import { NgxTablePopupComponent } from './crud-ngx-table/ngx-table-popup/ngx-table-popup.component';
import { DetailCrudComponent } from './crud-detail/detail-crud/detail-crud.component';

import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'app/shared/shared.module';
import { MatSortModule } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { CrudNgxTableComponent } from './crud-ngx-table/crud-ngx-table.component';
import { CrudPartnerService } from './crudPartner.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ContactService } from '../contact/contact.service';
import { RequirementDetailsComponent } from './requirements-details/requirements-details.component';
import { ContactsDetailsComponent } from './crud-ngx-table/contacts-details/contacts-details.component';




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
    MatTabsModule,


    RouterModule.forChild(CrudsRoutes)
  ],
  declarations: [CrudNgxTableComponent, NgxTablePopupComponent, DetailCrudComponent , RequirementDetailsComponent, ContactsDetailsComponent],
  providers: [ContactService, CrudPartnerService]
})
export class PartnerModule { }
