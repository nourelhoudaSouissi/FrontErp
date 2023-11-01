import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TresorerieRoutes } from './tresorerie-routing.module';
import { TresorerieListComponent } from './tresorerie-list/tresorerie-list/tresorerie-list.component';
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
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedModule } from 'app/shared/shared.module';

import { TresorerieService } from './tresorerie.service';
import { MatStepperModule } from '@angular/material/stepper';
import { DecaissementComponent } from './decaissement/decaissement.component';
import { EncaissementComponent } from './encaissement/encaissement.component';
import { DecaissementPopUpComponent } from './decaissement/decaissement-pop-up/decaissement-pop-up.component';
import { EncaissementPopUpComponent } from './encaissement/encaissement-pop-up/encaissement-pop-up.component';
import { TresoreriePopUpComponent } from './tresorerie-list/tresorerie-list/tresorerie-pop-up/tresorerie-pop-up.component';


@NgModule({
 
  imports: [
    CommonModule,
    CommonModule,
    MatStepperModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    SharedComponentsModule,
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

    RouterModule.forChild(TresorerieRoutes)
  ],
  declarations: [TresorerieListComponent, DecaissementComponent, EncaissementComponent, DecaissementPopUpComponent, EncaissementPopUpComponent, TresoreriePopUpComponent ],
  providers: [TresorerieService]
})
export class TresorerieModule { }
