import { Evaluation } from 'app/shared/models/Evaluation';
import { entretienRecrutmentService } from './../entretienRecrutment.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from '../../candidate/CandidatCrud/candidat-crud.service';
import { interviewStatus } from 'app/shared/models/Interview';
import { evaluationPopupComponent } from '../evaluationnPopup/evaluation-popup.component';
import { ViewAllInterviewsComponent } from './viewAll-Interviews/viewAll-Interviews.component';
import { Title } from 'app/shared/models/Employee';


@Component({
  selector: 'evaluation-form',
  templateUrl: './crud_entretienRecrutment.component.html',
  styleUrls: ['./crud_entretienRecrutment.component.scss'],
})
export class crudEntretienRecrutmentComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public dataSource: any;
  public displayedColumns: any;
  public getItemSub: Subscription;
  classAdded = false;
  evaluation :Evaluation;
  interviewId: number 
  interviewStatus :any= Object.values(interviewStatus);
  selectedEvaluation= { id:null};
  title :string[]= Object.values(Title);
  showInput1 = false;
  showInput2 = false;
  showInput3 = false;


  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudEntretien: entretienRecrutmentService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private router: Router
  ) { }
   

  goToCV() {
    this.router.navigate(['cvCandidat/cvCandidat-crud']);
  }

  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }

  getDisplayedColumns() {
    return ['name', 'last name','title', 'actions'];
  }

    
    getItems() {    
      this.getItemSub = this.crudEntretien.getItems()
        .subscribe((data:any)  => {
          data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })    
         }

  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }

  
  openEvaluationCandidat(){
    this.router.navigate(['CandidatEvaluation/evaluationCandidat'])
  }

  goToEvaluer(){
    this.router.navigate(['evaluationCrud/crudEvaluation'])
  }

  
   openPopUp(row: any): void {
    const dialogRef = this.dialog.open(evaluationPopupComponent, {
      width: '900px',
      data: {id : row }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('Result:', result);
    });
  }

  
  viewAllEvaluations(row: any) {
    this.crudEntretien.getEmployeeEvaluation(row.id).subscribe((evaluations: Evaluation) => {
      const dialogRef = this.dialog.open(ViewAllInterviewsComponent, {
        width: '550px',
        data: { evaluations }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    });
  }
  

  /*onShowEvaluation() {
    if (this.classAdded) {
      // Class has already been added, so just open the view
      this.openView();
    } else {
      // Class hasn't been added, so create a new class, add it, and open the view
      const newClass = new MyClass();
      this.myClassService.addClass(newClass).subscribe(() => {
        this.classAdded = true;
        this.openView();
      });
    }
  }*/
  
  openView(row: any) {
    this.router.navigate(['/CandidatEvaluation', row.id]);
  }


//fonction tekhdem-----------
//---PS:ena f request mtei aandi employeeId ken aandek employeeNum badal Num


  /*saveEvaluation(id: number): void {
    this.crudEntretien.addEvaluation({employeeNum:id}).subscribe(
      response => console.log('Evaluation added successfully'),
      error => console.error('Error adding evaluation:', error)

    );
}*/ //gets saved as many times as u press the button 




////EL fonction hedhy ya sidek ben sidek , matkhalich evaluation ttsajel martyn , ama kif taaml refresh tensa l hkeya w taawed taml evluation , heka aleh amalt l fnct eli baadha , eli ma tensech kif trefreshi




private evaluationCreatedMap = new Map<number, boolean>();
// Check if an evaluation has already been created for this employee
  /*if (this.evaluationCreatedMap.get(id)) {
    console.log('Evaluation already created for this employee');
    return;
  }*/
/*saveEvaluation(id: number): void {
  

  this.crudEntretien.addEvaluation({ employeeNum: id }).subscribe(
    response => {
      console.log('Evaluation added successfully');
    },
    error => console.error('Error adding evaluation:', error)
  );
}*//*

openpopup(row:any): void {
  const dialogRef = this.dialog.open(evaluationPopupComponent, {
    width: '300px',
    data: { row }
    
  }
  
  );
console.log(row.id)
  dialogRef.afterClosed().subscribe(result => {
    console.log('Popup closed');
    if (result === 'view') {
      this.router.navigate(['/CandidatEvaluation', row.id]);
    }
    // Perform any additional actions after the popup is closed
  });

}*/


/////////////////////////////////hedhy l fonction eli ma tensech////////////////////////////////

/*saveEvaluation(id: number): void {
  // Get the evaluationCreatedMap from local storage
  const evaluationCreatedMapStr = localStorage.getItem('evaluationCreatedMap');
  let evaluationCreatedMap: Map<number, boolean>;
  try {
    evaluationCreatedMap = evaluationCreatedMapStr ? new Map(JSON.parse(evaluationCreatedMapStr)) : new Map<number, boolean>();
  } catch (error) {
    console.error('Error parsing evaluationCreatedMap:', error);
    evaluationCreatedMap = new Map<number, boolean>();
  }

  // Check if an evaluation has already been created for this employee
  if (evaluationCreatedMap.get(id)) {
    console.log('Evaluation already created for this employee');
    return;
  }
  
  // Create new evaluation
  this.crudEntretien.addEvaluation({employeeNum:id}).subscribe(
    response => {
      console.log('Evaluation added successfully');
      // Set flag to indicate that evaluation has been created for this employee
      evaluationCreatedMap.set(id, true);
      // Save the updated evaluationCreatedMap to local storage
      localStorage.setItem('evaluationCreatedMap', JSON.stringify(Array.from(evaluationCreatedMap.entries())));
    },
    error => console.error('Error adding evaluation:', error)
  );
}*/



saveEvaluation(id: number): void {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString(); // Convert to string in desired format
  
  const evaluation: Evaluation = {
    id: id,
    evaluationDate: formattedDate,
  };

  this.crudEntretien.addEvaluation({ employeeNum: id }).subscribe(
    response => {
      console.log('Evaluation added successfully');
      const newEvaluationId = response.id; // Assuming the response contains the new evaluation ID
      this.openpopup({ id: newEvaluationId }); // Open the popup with the new evaluation ID
    },
    error => console.error('Error adding evaluation:', error)
  );
}


openpopupp(row: any): void {
  console.log('Open popup for employee:', row.id);
  
  this.crudEntretien.addEvaluation({ employeeNum: row.id }).subscribe(
    response => {
      console.log('Evaluation added successfully:', response);
      const newEvaluationId = response.id;
      
      const dialogRef = this.dialog.open(evaluationPopupComponent, {
        width: '300px',
        data: { row }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Popup closed');
        if (result === 'view') {
          console.log('View evaluation clicked');
          this.router.navigate(['/CandidatEvaluation', newEvaluationId]);
        }
        // Perform any additional actions after the popup is closed
      });
    },
    error => console.error('Error adding evaluation:', error)
  );
}

openpopup(row: any): void {
  this.confirmService.confirm({ message: `Voulez-vous vraiment ajouter une évaluation à ${row.lastName} ${row.firstName}?` })
    .subscribe(res => {
      if (res) {
        this.loader.open('Ajout de l\'évaluation');

        this.crudEntretien.addEvaluation({ employeeNum: row.id })
          .subscribe((data: any) => {

            // Close the loader before showing the snack bar
            this.loader.close();

            this.snack.open('Evaluation ajoutée !', 'OK', { duration: 2000 });
          });
      }
    });
}




//status 

applyFilterr(event: Event, key: string) {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  const filterWords = filterValue.split(' ');

  this.dataSource.filterPredicate = (data, filter) => {
    // Split the data value into words and convert to lowercase
    const dataWords = data[key].trim().toLowerCase().split(' ');

    // Check if all filter words are present in the data (case-insensitive)
    return filterWords.every(word => {
      return dataWords.some(dataWord => dataWord.indexOf(word.toLowerCase()) !== -1);
    });
  };

  this.dataSource.filter = filterValue;

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
} 



toggleInput1() {
  this.showInput1 = !this.showInput1;
}

toggleInput2() {
  this.showInput2 = !this.showInput2;
}

toggleInput3() {
  this.showInput3 = !this.showInput3;
}


employeeTitleMap = {
  [Title.FRONT_END_DEVELOPER]: 'Développeur Front-End',
  [Title.BACK_END_DEVELOPER]: 'Développeur Back-End',
  [Title.FULLSTACK_DEVELOPER]: 'Développeur Full-Stack',
  [Title.CRM]: 'CRM',
  [Title.HUMAN_RESOURCE_MANAGER]: 'Responsable des Ressources Humaines',
  [Title.HUMAN_RESOURCE]: 'Ressources Humaines',
  [Title.PROJECT_MANAGER]: 'Chef de Projet',
  [Title.TECH_LEAD]: 'Chef de Projet',
  [Title.UI_UX_DESIGNER]: 'Concepteur UI/UX',
  [Title.QA_ENGINEER]: 'Ingénieur QA',
  [Title.DEVOPS_ENGINEER]: 'Ingénieur DevOps',
  [Title.WEB_DEVELOPER]: 'Développeur Web',
  [Title.OFFICE_MANAGER]: 'Responsable d Agence',
  [Title.ACCOUNTANT]: 'Comptable',
  [Title.SALES_REPRESENTATIVE]: 'Représentant Commercial',
  [Title.CUSTOMER_SUPPORT_SPECIALIST]: 'Spécialiste du Support Client',
  [Title.MARKETING_COORDINATOR]: 'Coordinateur Marketing'
  
};
}

