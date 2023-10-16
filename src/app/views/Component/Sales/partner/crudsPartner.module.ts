import { CrudsRoutes } from './crudsPartner.routing';

import { NgxTablePopupComponent } from './crud-ngx-table/ngx-table-popup/ngx-table-popup.component';
import { DetailCrudComponent } from './crud-detail/detail-crud/detail-crud.component';

import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
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
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule} from '@angular/core';
import { AngularIbanModule } from 'angular-iban';

import { CrudNgxTableComponent } from './crud-ngx-table/crud-ngx-table.component';
import { CrudPartnerService } from './crudPartner.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ContactService } from '../contact/contact.service';
import { RequirementDetailsComponent } from './requirements-details/requirements-details.component';
import { ContactsDetailsComponent } from './crud-ngx-table/contacts-details/contacts-details.component';
import { addAddressComponent } from '../add-address/add-address.component';
import { PartnerContactPopComponent } from './partner-contact-pop/partner-contact-pop.component';
import { SocialMediaPopComponent } from './social-media-pop/social-media-pop.component';
import { OfferedPopComponent } from './offered-pop/offered-pop.component';
import { AccountPopComponent } from './account-pop/account-pop.component';
import { PartnerStepperComponent } from './partner-stepper/partner-stepper.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { DatesPopupComponent } from './crud-detail/detail-crud/dates-popup/dates-popup.component';
import { AccountDetailsComponent } from './crud-detail/detail-crud/account-details/account-details.component';
import { CommentPopupComponent } from './crud-detail/detail-crud/comment-popup/comment-popup.component';





@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
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
    MatCheckboxModule,
    FormsModule,
    MatStepperModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatTabsModule,
    MatGridListModule,
    MatNativeDateModule,
    AngularIbanModule,

    RouterModule.forChild(CrudsRoutes)
  ],
  declarations: [CrudNgxTableComponent, NgxTablePopupComponent, DetailCrudComponent , RequirementDetailsComponent, ContactsDetailsComponent , addAddressComponent, PartnerContactPopComponent, SocialMediaPopComponent, OfferedPopComponent, AccountPopComponent, PartnerStepperComponent,DatesPopupComponent,CommentPopupComponent, AccountDetailsComponent],
  providers: [ContactService, CrudPartnerService, DatePipe] 
})
export class PartnerModule { }
