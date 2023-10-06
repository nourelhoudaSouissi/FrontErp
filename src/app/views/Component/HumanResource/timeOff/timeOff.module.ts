import { QuillModule } from 'ngx-quill';
import { MatSelectModule } from '@angular/material/select';
import { CrudsTimeOffRoutes } from './timeOff.routing';
import { CrudTimeOffTableComponent } from './crud-ngx-table/crudTimeOff-table.component';
import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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


import {  CrudTimeOffService } from './timeOff.service';
import {  PopupCreateTimeOffComponent } from './crud-ngx-table/ngx-table-popup/popup-createTimeOff.component'
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';


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
    MatSelectModule,
    QuillModule.forRoot(),
    RouterModule.forChild(CrudsTimeOffRoutes)
  ],
  declarations: [CrudTimeOffTableComponent, PopupCreateTimeOffComponent],
  providers: [CrudTimeOffService]
})
export class TimeOffModule { }
