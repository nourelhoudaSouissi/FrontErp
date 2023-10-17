import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators, UntypedFormGroup, UntypedFormControl, FormArray, AbstractControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Employee, Title } from "app/shared/models/Employee";
import { ProjectStatus, ProjectType, Devise } from "app/shared/models/Projet";
import { ResourceService } from "../../../resource/resource.service";
import { ProjetService } from "../../projet.service";
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'app-ngx-table-popup',
    templateUrl: './affectation.component.html'
  })
  export class AffectationComponent implements OnInit {
    public itemForm: FormGroup;;
    public Form: FormGroup;
    
    ProjectStatus = Object.values(ProjectStatus);
    ProjectType = Object.values(ProjectType);
    devise = Object.values(Devise)
    ressourceId:number;
    selectedResources: number[] = [];
    selectedRowIds: number[] = [];
    selection = new SelectionModel<Employee>(true, []);
    selectedResourceIds: number[] = [];
    states: string[];
    selectedFile: File;
    formRessource:FormGroup;
    submitted=false;
    resources : Employee[]
    responsables : Employee[] = []
    public dataSource: MatTableDataSource<Employee>;
    formWidth = 200; // declare and initialize formWidth property
    formHeight = 700; // declare and initialize formHeight property
    
    public displayedColumns: any;
    
    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<AffectationComponent>,
      private fb: FormBuilder,
      private crudService: ProjetService,  
      private resourceService : ResourceService
    ) {    
      
      this.dataSource = new MatTableDataSource<Employee>([]);
    }
    isFieldEnabled(): boolean {
      return !this.data.isNew; // Enable the field if isNew is true
    }
    
  
    getDisplayedColumns() {
      return ['select', 'Nom' , 'Prénom' , 'Poste' ];
    }
    buildItemForm(item){
      this.itemForm = this.fb.group({
          
        resourceId:[this.selectedRowIds.values|| '', Validators.required],
        
        
  
         });
        
  
    }
  
   
    ngOnInit() {
      this.displayedColumns=this.getDisplayedColumns()
     this.getRessource()
      this.getResources()
      this.buildItemForm(this.data.payload)
     
    }
  
    submit() {
      this.dialogRef.close(this.itemForm.value)
    }
    
   
   
   
     getResources(){
      this.resourceService.getItems().subscribe((data :any )=>{
        this.resources = data
       // this.partnerId = this.data.partnerId;
      });
    }
    getRessource(){
    
      this.resourceService.getItems().subscribe((data:any) =>{
  this.dataSource.data=data;
  
      })
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */

  /** The label for the checkbox on the passed row */
  toggleSelection(event: MatCheckboxChange, row: Employee) {
  
    this.selection.toggle(row);
    this.updateSelectedRowIds();
    this.updateResourceIds()
      }
  
  toggleSelectionAll(event: MatCheckboxChange) {
   
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
    this.updateSelectedRowIds();
  }
  updateSelectedRowIds() {
    this.selectedRowIds = this.selection.selected.map(row => row.id);
  }
  updateResourceIds() {
    this.itemForm.get('resourceId').setValue(this.selectedRowIds); // Update the resourceIds form control value
  }
    }