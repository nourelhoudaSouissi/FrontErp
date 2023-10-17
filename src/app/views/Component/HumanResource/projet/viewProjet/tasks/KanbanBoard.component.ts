// kanban-board.component.ts
import { Component, ElementRef, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { ProjetService } from '../../projet.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskPopupComponent } from './taskPopup/taskPopup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { Employee } from 'app/shared/models/Employee';
import { TaskViewComponent } from './taskPopup/taskView.component';
import { ModifTaskComponent } from '../../add projet/modifTaskPopup/modifTask.component';
import { taskPhase } from 'app/shared/models/Task';


@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanbanBoard.component.html',
  styleUrls: ['./kanBoard.component.css']
})
export class KanbanBoardComponent implements OnInit {
  id :number
  isSubtaskPanelOpen: boolean = false;
  selectedTask: any;
  subtasksDataSource: MatTableDataSource<any>;
  subtaskDisplayedColumns: string[] = ['SubtaskTitle'];
resources : Employee[]
  projet : any
  phases:any[]
  private tasks: any[]
  public dataSource: MatTableDataSource<any>;
    public displayedColumns: any;
  currentDate: Date=new Date();
  constructor(
    private router : ActivatedRoute,
    private crudService: ProjetService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    
      private loader : AppLoaderService,
      private elementRef: ElementRef
    
  ) { this.dataSource = new MatTableDataSource<any>([]); }

  ngOnInit() {
    this.id = this.router.snapshot.params['id'];
    this.getItem()
    this.gettask()
    this.gettasks()
    this.displayedColumns = this.getDisplayedColumns();
    this.getRessources();
    this.getPhases();
  }
  gettask(){
    this.crudService.getTasks(this.id).subscribe((data:any) =>{
this.tasks=data
    })}
    gettasks(){
      this.crudService.ProjectTask(this.id).subscribe((data:any) =>{
  this.dataSource=data
      })}
      getPhases(){
        this.crudService.ProjectPhase(this.id).subscribe((data:any)=>{
          this.phases=data
        })
      }
  getItem(){
    this.crudService.getItem(this.id).subscribe((data:any) =>{
this.projet=data
    })
}
toggleSubtaskPanel(task: any) {
  this.selectedTask = task;
  this.isSubtaskPanelOpen = !this.isSubtaskPanelOpen;
}
getDisplayedColumns() {
  return ['Tache','Titre' ,'Description' , 'DateDébut' , 'DateFin','Resource' ,'Etat','Actions'];
}
isEndDateExpired(row: any): boolean {
  const endDate = new Date(row.endDate);
  const taskPhase = row.taskPhase;
  return endDate < this.currentDate && taskPhase === "A_FAIRE";
}

deleteItem(row) {
  this.confirmService.confirm({message: `étes vous sure de supprission ?`})
    .subscribe(res => {
      if (res) {
        this.loader.open('Supprission du tache');
        this.crudService.deleteTask(row)
          .subscribe((data:any)=> {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('tache supprimée!', 'OK', { duration: 2000 });
            this.gettasks();
          })
      }
    })
}



/* statuses: string[] = ['A_FAIRE', 'EN_COURS','TEST','TERMINE'];*/
  // TypeScript code


// Store the statuses in local storage



  /*getTasksByStatus(status: string): Task[] {
    const currentDate = new Date();
    return this.tasks.filter(task => task.taskPhase === status);
  }*/
  getRessources(){
    this.crudService.getResources(this.id).subscribe((data:any) =>{
this.resources=data
    })
}
  /*onDragStart(event: DragEvent, task: any): void {
    event.dataTransfer!.setData('text/plain', task.id.toString());
  }*/

  /*onDrop(event: CdkDragDrop<Task[], any>, status: string): void {
    const taskId = +event.item.data;
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    this.tasks[taskIndex].status = status;
    moveItemInArray(this.tasks, taskIndex, event.currentIndex);
  }*/
  /*getStatusClass(status: string): string {
    switch (status) {
      case 'A_FAIRE':
        return 'status-todo';
      case 'EN_COURS':
        return 'status-in-progress';
      case 'TERMINE':
        return 'status-done';
       default:
        return 'status-test';
    }
  }*/
  openPopUp(data:  any , isNew?) {
    let title = isNew ? 'Nouvelle tache' : 'Modifier projet';
    this.crudService.getResources(this.id).subscribe((resources: any) => {
    let dialogRef: MatDialogRef<any> = this.dialog.open(TaskPopupComponent, {
      width: '1000px',

      disableClose: true,
      data: { title: title, payload: data , isNew: isNew , resources : this.resources , phases :this.phases , projectId : this.id , projet : this.projet , tasks : this.tasks}
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        
         }
        if (isNew) {
          this.loader.open('Ajout en cours');
          this.crudService.addTask(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('tache ajouté avec succès!', 'OK', { duration: 2000 });
              this.gettasks()
             /* this.gettask()*/
            });
            
        } else {
          this.loader.open('modification en cours');
          this.crudService.updateTask(data.id,res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Task modifiée avec succées !', 'OK', { duration: 2000 });
              this.gettasks();
            })
      }
      });
    });
  }
  openPopUpModif(data:  any , isNew?) {
    let title = isNew ? 'Nouvelle tache' : 'Modifier projet';
    this.crudService.getResources(this.id).subscribe((resources: any) => {
    let dialogRef: MatDialogRef<any> = this.dialog.open(ModifTaskComponent, {
      width: '1000px',

      disableClose: true,
      data: { title: title, payload: data , isNew: isNew , resources : this.resources , phases :this.phases , projectId : this.id , projet : this.projet , tasks : this.tasks}
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        
         }
        if (isNew) {
          this.loader.open('Ajout en cours');
          this.crudService.addTask(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('tache ajouté avec succès!', 'OK', { duration: 2000 });
              this.gettasks()
             /* this.gettask()*/
            });
            
        } else {
          this.loader.open('modification en cours');
          this.crudService.updateSubTask(data.id,res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Tache modifiée avec succées !', 'OK', { duration: 2000 });
              this.gettasks();
            })
      }
      });
    });
  }
  isTaskInDelay(task: any) : boolean {
    const currentDate = new Date();
    return task.endDate < currentDate 
  
    }
    openPopUpView(row: any): void {
      const dialogRef = this.dialog.open(TaskViewComponent, {
        width: '720px',
        data:  { task : row},
      });
    
      dialogRef.afterOpened().subscribe(() => {
        console.log('Dialog opened successfully.');
      });
    
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        // Code executed after the dialog is closed
      }, error => {
        console.error('An error occurred while opening the dialog:', error);
        // Handle the error appropriately (e.g., display an error message)
      });
  
      

   
}
taskPhaseMap={
  [taskPhase.A_FAIRE]:'à faire',
  [taskPhase.EN_COURS]:'en cours',
  [taskPhase.TERMINE]:'terminée',
  [taskPhase.TEST]:'test',
}
}