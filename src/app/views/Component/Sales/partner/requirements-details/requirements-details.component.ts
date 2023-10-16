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
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-requirements-details',
  templateUrl: './requirements-details.component.html',
  
})
export class RequirementDetailsComponent implements OnInit {
  
    displayedColumns: any;
  
   // Declare requirements as an empty array
    public dataSource: MatTableDataSource<req>;
id: number
public getItemSub: Subscription;
  constructor(    private route: ActivatedRoute,
    private crudService: CrudPartnerService,private dialog: MatDialog,
    private snack: MatSnackBar,
  
    private confirmService: AppConfirmService,
    private loader: AppLoaderService) {   this.dataSource = new MatTableDataSource<req>([]);}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['iiid']; 
    console.log(this.id)
    this.getRequirements();
    this.displayedColumns = this.getDisplayedColumns();
    
}
getDisplayedColumns() {
    return ['title','description','criteria',
    
    'totalCandidateNumber','requirementType','requirementStatus','availability'
    ];
  }
  getRequirements() {
    
    this.crudService.getItemReq(this.id).subscribe((data) => {
      {
        this.dataSource = new MatTableDataSource(data);
     
       
      }
    },
    
      (error) => {
        console.error(error);
        this.loader.close(); // Close loader if there is an error
      })}}


  
