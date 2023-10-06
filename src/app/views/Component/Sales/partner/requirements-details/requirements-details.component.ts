import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute } from '@angular/router';

import { Partner } from 'app/shared/models/Partner';
import { req } from 'app/shared/models/req';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CrudPartnerService } from '../crudPartner.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-requirements-details',
  templateUrl: './requirements-details.component.html',
  
})
export class RequirementDetailsComponent implements OnInit {
  
    displayedColumns: any;
  
   // Declare requirements as an empty array
    public dataSource: MatTableDataSource<any>;
id: number

  constructor(    private route: ActivatedRoute,
    private crudService: CrudPartnerService,private dialog: MatDialog,
    private snack: MatSnackBar,
  
    private confirmService: AppConfirmService,
    private loader: AppLoaderService) {   this.dataSource = new MatTableDataSource<any>([]);}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['requirements/:iiid'];
    this.getRequirements();
    this.displayedColumns = this.getDisplayedColumns();
    
}
getDisplayedColumns() {
    return ['title','description','Criteria','plannedBudget',
    
    'totalCandidateNumber','requirementType','requirementStatus','workField','availability','actions',
    ];
  }
  getRequirements() {
    
    this.crudService.getItem(this.id).subscribe((data: Partner) => {
      this.dataSource.data = data.requirements;

    });
  }}
