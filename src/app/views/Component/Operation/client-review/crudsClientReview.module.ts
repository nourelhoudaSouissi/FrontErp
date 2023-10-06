import { NgxClientReviewTablePopupComponent } from './crud-ngx-table/ngx-table-popup/ngx-table-popup-client-review.component';
import { CrudClientReviewService } from './crudClientReview.service';
import { CrudsClientReviewRoutes } from './crudsClientReview.routing';
import { SharedModule } from '../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule }  from '@angular/material/core';
import { CrudClientReviewNgxTableComponent } from './crud-ngx-table/crud-ngx-table-client-review.component';

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
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    RouterModule.forChild(CrudsClientReviewRoutes)
  ],
  declarations: [CrudClientReviewNgxTableComponent, NgxClientReviewTablePopupComponent],
  providers: [CrudClientReviewService]
})
export class CrudsClientReviewModule { }
