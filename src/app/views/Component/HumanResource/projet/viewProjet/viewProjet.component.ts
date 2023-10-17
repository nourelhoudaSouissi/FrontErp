import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Employee, Title } from 'app/shared/models/Employee';
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";

import { Projet } from "app/shared/models/Projet";
import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
import { LoaderDialogComponent } from "app/views/app-dialogs/loader-dialog/loader-dialog.component";


import { Subscription } from "rxjs";
import { ResourceService } from "../../resource/resource.service";
import { ProjetService } from "../projet.service";
import { AffectationComponent } from "./affectationResource/affecatation.component";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'Viewprojet-crud',
    templateUrl: './viewProjet.component.html'
  })
  
  
  export class ViewProjetComponent implements OnInit {
   
    
    
   id : number ;
    
   
    public projet : any 
    public dataSource: MatTableDataSource<Employee>;
    public displayedColumns: any;
    public getItemSub: Subscription;
    public Responsables : any[];
    public dataSource2 : MatTableDataSource<any>
  
    constructor(
      private router : ActivatedRoute,
      private snack: MatSnackBar,
      private dialog: MatDialog,
      private loader : AppLoaderService,
      private crudService: ProjetService,
      private resourceService: ResourceService,
      private datePipe: DatePipe,
     
    ) {this.dataSource = new MatTableDataSource<Employee>([]); 
      this.dataSource2= new MatTableDataSource<any>([])

    }
  
    ngOnInit() {
     
        this.id = this.router.snapshot.params['id'];
      this.getItem()
     
      this.displayedColumns = this.getDisplayedColumns();
      this.getRessources();
      this.getResp();
    }
    getDisplayedColumns() {
        return ['Reference','Titre' , 'Date début' ];
      }
    getItem(){
        this.crudService.getItem(this.id).subscribe((data:any) =>{
    this.projet=data
        })
    }
    getRessources(){
        this.crudService.getResources(this.id).subscribe((data:any) =>{
    this.dataSource=data
        })
    }
    getResp(){
      this.crudService.getResp(this.id).subscribe((data:any) =>{
  this.dataSource2=data
      })
  }
    TitleMap = {
        [Title.CRM]:'CRM',
        [Title.PROJECT_MANAGER]:'Chef du projet',
        [Title.BACK_END_DEVELOPER]:'Développeur back-end',
        [Title.FULLSTACK_DEVELOPER]:'Développeur fullStack',
        [Title.DEVOPS_ENGINEER]: 'Développeur devops',
        [Title.FRONT_END_DEVELOPER]: 'Développeur frontEnd '
       
      }
      async  openPopUp(data: any, isNew?) {
        let title = isNew ? 'Nouveau projet' : 'Modifier projet';
        let dialogRef: MatDialogRef<any> = this.dialog.open(AffectationComponent, {
          width: '500px',
          height:'100px',
          disableClose: true,
          data: { title: title, payload: data, isNew: isNew }
        });
      
      await  dialogRef.afterClosed().subscribe(res => {
          if (!res) {
            // If user presses cancel
            return;
          }
      
         // if (isNew) {
            const resourceId = res.resourceId;
            
            this.crudService.addResourceToProject(this.id, resourceId).subscribe(async (data: any) => {
             this.loader.close();
              this.snack.open('resource affecté avec succès!', 'OK', { duration: 2000 });
            await  this.getRessources()
            });
          }
        //}
        );
      }
      
    }