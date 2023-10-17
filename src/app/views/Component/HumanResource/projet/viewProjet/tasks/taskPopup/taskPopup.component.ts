import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { taskPhase } from "app/shared/models/Task";
import { ResourceService } from "app/views/Component/HumanResource/resource/resource.service";
import { ProjetService } from "../../../projet.service";
import { Projet } from "app/shared/models/Projet";
import { Employee } from "app/shared/models/Employee";

@Component({
    selector: 'app-ngx-table-popup',
    templateUrl: './taskPopup.component.html',
   
  })
  export class TaskPopupComponent implements OnInit {
    projectStartDate: Date;
    projectEndDate: Date;
    id:number
    resources : Employee[]
    phases : any[]
    dataSource : any
    taskPhase = Object.values(taskPhase);
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TaskPopupComponent>,
    public resourceService : ResourceService,
    public crudService : ProjetService,
    public router : ActivatedRoute,
    private fb: FormBuilder,){
      this.projectStartDate = this.data.projet.startDate;
      this.projectEndDate = this.data.projet.endDate
    }
    public itemForm: FormGroup;
    buildItemForm(item){
      
        this.itemForm = this.fb.group({
           
            title : [item.title || '', Validators.required], 
          
          description: [item.description || '', Validators.required],
         
          startDate: [item.startDate ||'', Validators.required, ],
          endDate : [item.endDate || '', Validators.required],
            estimation : [item.estimation || Validators.required],
            remaining : [item.remaining],
          taskPhase:['A_FAIRE'],
         
          projectNum:[this.data.projectId],
          status :[item.status],
          resourceNum : [item.resourceNum],
          phaseNum : [item.phaseNum],
          taskNum:[item.taskNum],
          reference:[item.reference],
          subTaskReference:[item.subTaskReference]
           });
          
          }
    ngOnInit() {
        this.buildItemForm(this.data.payload)
        this.resources = this.data.resources
        this.phases=this.data.phases
        this.id = this.router.snapshot.params['id'];
        this.dataSource = this.data.tasks
    }
   
    submit() {
        this.dialogRef.close(this.itemForm.value)
      }
    
      onSubtaskChange() {
        const selectedSubtask = this.itemForm.get('taskNum').value;
        if (selectedSubtask) {
          const subtask = this.dataSource.find(task => task.id === selectedSubtask);
          if (subtask) {
            this.itemForm.get('startDate').setValue(subtask.startDate);
            this.itemForm.get('endDate').setValue(subtask.endDate);
            this.itemForm.get('endDate').enable();
          }
        } else {
          this.itemForm.get('endDate').setValue(null);
          this.itemForm.get('endDate').disable();
        }
      }
      
      
      
      
      
      
      
  }