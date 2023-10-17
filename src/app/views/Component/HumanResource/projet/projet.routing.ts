import { Routes } from "@angular/router";
import { ProjetComponent } from "./add projet/projet.component";
import { KanbanBoardComponent } from "./viewProjet/tasks/KanbanBoard.component";
import { TaskPopupComponent } from "./viewProjet/tasks/taskPopup/taskPopup.component";
import { ViewProjetComponent } from "./viewProjet/viewProjet.component";


export const ProjetRoutes: Routes = [
    { 
      path:'projet', 
      component: ProjetComponent,
      data: { title: 'list' , breadcrumb: 'Liste des projets' } 
    },
    
      {
        path: ":id",
        component:ViewProjetComponent ,
        pathMatch: "full"
      },
      {
        path: "tache/:id",
        component:KanbanBoardComponent ,
        pathMatch: "full"
      },
      {
        path: "pop/:id",
        component:TaskPopupComponent ,
        pathMatch: "full"
      }
    
]