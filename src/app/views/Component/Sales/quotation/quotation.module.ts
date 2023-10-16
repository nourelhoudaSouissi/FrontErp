import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationDetailComponent } from './quotation-detail/quotation-detail.component';
import { QuotationPopComponent } from './quotation-pop/quotation-pop.component';
import { QuotationListComponent } from './quotation-list/quotation-list.component';
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
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';
import { QuotationsRoutes } from './quotation.routing';
import { CrudPartnerService } from '../partner/crudPartner.service';
import { ReqService } from '../Requirement/req.service';



@NgModule({
  declarations: [
    QuotationDetailComponent,
    QuotationPopComponent,
    QuotationListComponent
  ],
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
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    RouterModule.forChild(QuotationsRoutes)
  ],
  providers: [
    ReqService,
    CrudPartnerService
  ]
})
export class QuotationModule { }
