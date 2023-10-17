import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProjetService } from "../../../projet.service";
import { ActivatedRoute } from "@angular/router";
import { taskPhase } from "app/shared/models/Task";

@Component({
    selector: 'taskView',
    templateUrl: './taskView.component.html',
   
  })
  export class TaskViewComponent implements OnInit {
    task : any;

    constructor(
        private taskService :ProjetService,
        private dialog: MatDialogRef<TaskViewComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private route : ActivatedRoute) { }
    
      ngOnInit(): void {
        const data = this.data;
        this.task= data.task;
        
     
          }
          taskPhaseMap={
            [taskPhase.A_FAIRE]:'à faire',
            [taskPhase.EN_COURS]:'en cours',
            [taskPhase.TERMINE]:'terminée',
            [taskPhase.TEST]:'test',
          }
  }