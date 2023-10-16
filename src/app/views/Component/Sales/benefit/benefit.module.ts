import { BenefitListComponent } from './benefit-list/benefit-list.component';
import { BenefitRoutes } from './benefit.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { BenefitPopComponent } from './benefit-pop/benefit-pop.component';
import { BenefitService } from './benefit.service';
import { BenefitDetailComponent } from './benefit-detail/benefit-detail.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { WorkArrangementPopComponent } from './work-arrangement-pop/work-arrangement-pop.component';
import { ExtraDutyPopComponent } from './extra-duty-pop/extra-duty-pop.component';






@NgModule({
  declarations: [
    BenefitListComponent,
    BenefitPopComponent,
    BenefitDetailComponent,
    WorkArrangementPopComponent,
    ExtraDutyPopComponent
  ],
  providers: [
    BenefitService
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
    MatCheckboxModule,
    RouterModule.forChild(BenefitRoutes)
  ]
})
export class BenefitModule { }
