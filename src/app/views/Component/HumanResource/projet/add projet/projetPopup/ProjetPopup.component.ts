
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  Validators,  FormGroup, FormBuilder, UntypedFormGroup, UntypedFormControl, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { Partner,CompanyStatus,WorkField,LegalStatus,Provenance ,Country} from 'app/shared/models/Partner';
import { ProjetService } from '../../projet.service';
import { Devise, Fnction, ProjectStatus, ProjectType, Projet } from 'app/shared/models/Projet';
import { ResourceService } from '../../../resource/resource.service';
import { Employee, Title } from 'app/shared/models/Employee';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PeriodicElement } from 'assets/examples/material/pagination-table/pagination-table.component';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './Projetpopup.component.html',
  styleUrls:['./ProjetPopup.component.css']
  
 
})
export class ProjetPopupComponent implements OnInit {
  public itemForm: FormGroup;;
  public Form: FormGroup;
  isLoading = true;
  ProjectStatus = Object.values(ProjectStatus);
  ProjectType = Object.values(ProjectType);
  fonction=Object.values(Fnction)
  devise = Object.values(Devise)
  ressourceId:number;
  states: string[];
  selectedFile: File;
  formRessource:FormGroup;
  submitted=false;
  resources : Employee[] 
  
  Noresponsables : Employee[] = []
  public dataSource: MatTableDataSource<Employee>;
  public displayedColumns: any;
  selection = new SelectionModel<Employee>(true, []);
  selectedResourceIds: number[] = [];

  formWidth = 200; // declare and initialize formWidth property
  formHeight = 1000; // declare and initialize formHeight property
  selectedResources: number[] = [];
  selectedRowIds: number[] = [];
  form: FormGroup;
  repeatForm : FormGroup;
  responsables : FormArray;
  myResponsableForm : FormGroup
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProjetPopupComponent>,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private responsableFb : FormBuilder,
    private crudService: ProjetService,  
    private resourceService : ResourceService
  ) {    
    
    this.dataSource = new MatTableDataSource<Employee>([]);
  }
 
  isFieldEnabled(): boolean {
    return !this.data.isNew; // Enable the field if isNew is true
  }
  
  getDisplayedColumns() {
    return ['select', 'Nom' , 'Prénom' , 'Poste' , 'Disponibilité' ];
  }

  buildItemForm(item){
   
    this.itemForm = this.fb.group({
        projectReference : [ item.projectReference||'', Validators.required],
        name : [item.name || '', Validators.required], 
      
      description: [ item.description||'', Validators.required],
      budget : [ item.budget||'', Validators.required ,],
      startDate: [item.startDate||'', Validators.required, ],
      endDate : [ item.endDate||'', Validators.required],
      projectType: [item.projectType||'', Validators.required],
      projectStatus : [ 'NOT_STARTED', Validators.required],
      resourceIds:[this.selectedRowIds.values|| '', Validators.required],
      responsableNum:[item.responsableNum|| '',Validators.required],
      realStartDate:[item.realStartDate||'',Validators.required],
      realEndDate:[item.realEndDate||'',Validators.required],
      lieu:[item.lieu|| ''],
      workingHourNumber:[item.workingHourNumber||''],
      devise:[item.devise||''],
      commande : [item.commande||''],
      responsables : this.fb.array([])  
      
       },);
       const responsableFormArray = this.itemForm.get('responsables') as FormArray;
       

if (item.responsables && item.responsables.length > 0) {
      item.responsables.forEach((responsable) => {
        responsableFormArray.push(this.fb.group({
          id: [responsable.id || ''],
          firstName: [responsable.firstName || '', Validators.required],
          lastName:[responsable.lastName||''],
          addressMail: [responsable.addressMail || ''],
          phoneNumber:[responsable.phoneNumber||''],
         
          function : [responsable.function||'']
        }));
      });
    } else {
      responsableFormArray.push(this.fb.group({
        id: [''],
        firstName: ['', Validators.required],
        lastName: [''],
        addressMail:[''],
        phoneNumber:[''],
        function:[''],

      }));
    }
       this.itemForm.get('startDate').valueChanges.subscribe((value) => {
        // If startDate is set, update the endDate control to disable all dates before the selected startDate
        if (value) {
          this.itemForm.get('endDate').enable();
          this.itemForm.get('endDate').setValidators([Validators.required, this.endDateValidator(value)]);
          this.itemForm.get('endDate').updateValueAndValidity();
        }
      });
 /*this.form=this.fb.group({
  responsableClients:this.fb.array([this.createResponsableClient()])
 });
 this.responsableClients = this.form.get('responsableClients') as FormArray;*/
  }
  ngOnInit() {
    
    this.myResponsableForm = this._formBuilder.group({
          responsables: this._formBuilder.array([])  // Initialize holidays as an empty FormArray
        });
    
        this.buildItemForm(this.data.payload)
    
        this.repeatForm = this._formBuilder.group({
          repeatArray: this._formBuilder.array([this.createRepeatForm()])
        })
       
        
        this.getRessources()
        this.displayedColumns=this.getDisplayedColumns()
        
        this.getResources()
        this.itemForm.get('budget').disable();
        this.itemForm.get('devise').disable();
    //this.getChefs()
    this.getNoChefs()
    
        this.formRessource = this.fb.group({
          value : new FormArray([])
         });
       
      
         (this.formRessource.get('value') as FormArray).push(this.fb.group({
          firstName: new UntypedFormControl('', []),
        }));
      }
  getRessources(){
    this.isLoading = true;
    this.resourceService.getItems().subscribe((data:any) =>{
this.dataSource.data=data;
this.isLoading = false;
    })
}
get myArrayControls() {
  return (this.myResponsableForm.get('responsables') as FormArray).controls;
}
createRepeatForm(): FormGroup {
    return this._formBuilder.group({});
  }
  
  
      
      handleAddRepeatForm() {
        this.repeatFormGroup.push(this.createRepeatForm());
      }
      get repeatFormGroup() {
        return this.repeatForm.get('repeatArray') as FormArray;
      }
      removeHolidayFormGroup(index: number): void {
        if (index === 0 && this.repeatFormGroup.length === 1) {
          return; // Skip removal
        }
        const holidaysFormArray = this.itemForm.get('responsables') as FormArray;
       
        holidaysFormArray.removeAt(index);
      }
      /*removeFormItem(index: number): void {
        if (index === 0 && this.responsableClients.length === 1) {
          return; // Skip removal
        }
        this.responsableClients.removeAt(index);
      }*/
  /*submit() {
    this.dialogRef.close(this.itemForm.value)
  }*/
  errorMessage : String 
  submit() {
    
    const startDateControl = this.itemForm.get('startDate');
    const endDateControl = this.itemForm.get('endDate');
  
    if (startDateControl.valid && endDateControl.valid) {
      console.log(this.selectedRowIds);
      this.dialogRef.close(this.itemForm.value);
    } else {
      if (startDateControl.invalid) {
        this.errorMessage = 'selectionner une date valide.';
      } else if (endDateControl.invalid) {
        this.errorMessage = 'selectionner une date valide.';
      } else {
        this.errorMessage = 'Please fill in all required fields and ensure the date is valid.';
      }
    }
   
  }
  endDateValidator(startDate: Date) {
    return (endDateControl) => {
      const endDate = new Date(endDateControl.value);
      if (endDate < new Date(startDate)) {
        return { 'min': true };
      }
      return null;
    };
  }
 
   getResources(){
    this.resourceService.getItems().subscribe((data :any )=>{
      this.resources = data
     // this.partnerId = this.data.partnerId;
    });
  }
  getChefs(){
    this.resourceService.getItemResponsable().subscribe((data: any) => {
      this.responsables = data;
     });
    }
    getNoChefs(){
      this.resourceService.getItemNoResponsable().subscribe((data: any) => {
        this.Noresponsables = data;
       });
      }
    dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
      const startDate = control.get('startDate')?.value;
      const endDate = control.get('endDate')?.value;
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return { 'invalidDate': true };
      }
      return null;
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
      this.itemForm.get('resourceIds').setValue(this.selectedRowIds); // Update the resourceIds form control value
    }
    
addHolidayFormGroup(): void {
        const holidaysFormArray = this.itemForm.get('responsables') as FormArray;
        
        const holidayarticleFormGroup = this._formBuilder.group({
          id: [''],
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          addressMail:[''],
          phoneNumber:[''],
          function:['']
         
        });
        holidaysFormArray.push(holidayarticleFormGroup);
      }

      typeMap={
        [ProjectType.INTERN] :'Interne',
        [ProjectType.EXTERN_FORFAIT] : 'Forfait_Externe',
        [ProjectType.EXTERN_T_AND_M] : 'T_et_M_Externe'
      
       }
  }
