import { Observable } from 'rxjs-compat';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { EquipmentService } from '../equipment.service';
import { MatTableDataSource } from '@angular/material/table';
import { ViewEquipmentComponent } from './view-equipment/view-equipment.component';
import { StatusDisponibility } from 'app/shared/models/equipment';
import { Router } from '@angular/router';
import { MotifUnavailabilityComponent } from './motif-unavailability/motif-unavailability.component';
import { Employee } from 'app/shared/models/Employee';
import { AffectationComponent } from './affectation/affectation.component';
import { map } from 'rxjs/operators';
import { ReturnEquipmentComponent } from './return-equipment/return-equipment.component';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit , OnDestroy{
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    StatusDisponibility :any= Object.values(StatusDisponibility);
    
    public dataSource: any;
 
    affectedCount : number;
    unaffectedCount : number;
    availableCount : number;
    unavailableCount : number ;
    employees: Employee[] = [];
    public displayedColumns: any;
    public getItemSub: Subscription;
    constructor(
      private router: Router,
      private dialog: MatDialog,
      private snack: MatSnackBar,
      private equipmentService : EquipmentService,
      private confirmService: AppConfirmService,
      private loader: AppLoaderService
    ) { }
  
    ngOnInit() {

   
      this.displayedColumns = this.getDisplayedColumns();
      this.getItems();
      this.loadEmployes(); // Chargement des employés
      this.getAllAvailableAff();
      this.getAllUnavailableAff();
      this.getAllAffected();
      this.getAllUnaffected();
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
      return ['reference', 'type','status', 'affectation','actions'];
    }
  
    getItems() {    
       this.equipmentService.getEquipments()
        .subscribe(data => {
          data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
    }
 
    onMotif(data: any): void {
      const dialogRef: MatDialogRef<any> = this.dialog.open(MotifUnavailabilityComponent, {
        width: '720px',
        disableClose: true,
        data: { payload: data }
      });
    
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.loader.open('Modifier motif');
          this.equipmentService.updateMotifById(data.id, res.motifUnavailability, res.disponibilityDate).subscribe((updatedData: any) => {
            this.dataSource = updatedData;
            this.loader.close();
            this.getItems();
            this.snack.open('Equipement modifié!', 'OK', { duration: 4000 });
          });
        } else {
          // If user presses cancel
          return;
        }
      });
    }

   
    
    onAffectation(data: any): void {
      const dialogRef: MatDialogRef<any> = this.dialog.open(AffectationComponent, {
        width: '720px',
        disableClose: true,
        data: { payload: data.id }
      });
    
      dialogRef.afterClosed().subscribe(res => {
      //  if (res && res.equipmentId) {  // Check if res and res.equipmentId are not null or undefined
          this.loader.open('Affectation d\'un équipement à un employé');
          this.equipmentService.addAffectation(res).subscribe(
            (updatedData: any) => {
              this.dataSource = updatedData;
              this.loader.close();
              this.getItems();
              this.snack.open('Equipement affecté!', 'OK', { duration: 4000 });
            },
            (error: any) => {
              this.loader.close();
              //this.snack.open('Une erreur s\'est produite lors de l\'affectation de l\'équipement.', 'OK', { duration: 4000 });
            }
          );
          /*  } else {
          // If user presses cancel or res.equipmentId is null or undefined
          return;
        }*/
      });
    }
    
   
    deleteItem(row) {
      this.confirmService.confirm({message: `Etes-vous sûr(e) de vouloir supprimer cet équipement ?`})
        .subscribe(res => {
          if (res) {
            this.loader.open('Supprimer équipement');
            this.equipmentService.deleteEquipment(row)
              .subscribe(data => {
                this.dataSource = data;
                this.loader.close();
                this.getItems();
                this.snack.open('Equipement Supprimé!', 'OK', { duration: 4000 })
              
              })
          }
        })
    }



    openPopUpView(row: any): void {
      const dialogRef = this.dialog.open(ViewEquipmentComponent, {
        width: '800px',
        data:  { equipment : row},
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
   

    

    openPopUReturn(row: any): void {
      const dialogRef = this.dialog.open(ReturnEquipmentComponent, {
        width: '720px',
        data:  { equipment : row},
      });
    
      dialogRef.afterOpened().subscribe(() => {
        console.log('Dialog opened successfully.');
      });
    
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.loader.open('Restituer Equipement');
          this.equipmentService.updateRestitutionById(row.id, res.returnComment, res.returnStatus, res.returnDate).subscribe((updatedData: any) => {
            this.dataSource = updatedData;
            this.loader.close();
            this.getItems();
            this.snack.open('Equipement restitué!', 'OK', { duration: 4000 });
          });
        } else {
          // If user presses cancel
          return;
        }
      }, error => {
        console.error('An error occurred while opening the dialog:', error);
        // Handle the error appropriately (e.g., display an error message)
      });
    }
   

   /******************************************** la fonction du changement de couleur du status*************************************/
   getStatusColor(status: string): { color: string, displayText: string } {

    const STATUS_DATA = {
      AVAILABLE: { color: 'primary', displayText: 'Disponible' },
      UNAVAILABLE : { color:'green', displayText: 'Indisponible' },
  
    };
      // Check if the status exists in the STATUS_DATA object
     if (status && STATUS_DATA.hasOwnProperty(status)) {
     return STATUS_DATA[status];
}

      // Default to 'AVAILABLE' if the status is not found
      return STATUS_DATA['AVAILABLE'];

  }
   
  changeStatus(status: string, row: any): void {
    console.log('Changing  status to:', status);
    let updateObservable: Observable<any>;
    switch (status) {
      case 'status.AVAILABLE':
        updateObservable = this.equipmentService.updateToAvailableById(row.id);
        break;
      case 'status.UNAVAILABLE':
        updateObservable = this.equipmentService.updateToUnavailableById(row.id);
        break;
      default:
        // Cas de statut de contrat non géré
        console.error('Statut non géré');
        return;
    }
    updateObservable.subscribe(
      (data) => {
        // handle success
        console.log('Mise à jour effectuée avec succès');
        if( status ==  "status.UNAVAILABLE")
          this.onMotif(row);
        this.getItems();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour : ', error);
      }
    );
  }
/************************************************* Affectation ************************************************/
  getAffectationColor(affectation: string): { color: string, displayText: string } {

    const AFFECTATION_DATA = {
      AFFECTED: { color: 'purple', displayText: 'Affecté' },
      UNAFFECTED : { color:'red', displayText: 'Non Affecté' },
  
    };
      // Check if the status exists in the STATUS_DATA object
     if (affectation &&  AFFECTATION_DATA .hasOwnProperty(affectation)) {
     return  AFFECTATION_DATA [affectation];
}

      // Default to 'AVAILABLE' if the status is not found
      return  AFFECTATION_DATA ['UNAFFECTED'];

  }


  changeAffectation(affectation: string, row: any): void {
    console.log('Changing affectation to:', affectation);
    let updateObservable: Observable<any>;
  
    switch (affectation) {
      case 'affectation.AFFECTED':
        updateObservable = this.equipmentService.updateAffectedById(row.id);
        break;
      case 'affectation.UNAFFECTED':
        updateObservable = this.equipmentService.updateUnaffectedById(row.id);
        break;
      default:
        // Cas de statut de contrat non géré
        console.error('Affectation non gérée');
        return;
    }
  
    updateObservable.subscribe(
      (data) => {
        // handle success
        console.log('Mise à jour effectuée avec succès');
  
        if (affectation === 'affectation.AFFECTED') {
          this.onAffectation(row);
        }
  
      
        row.employeeNum = data.employeeNum; // Mettre à jour l'ID de l'employé
  
        this.getItems();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour : ', error);
      }
    );
  }

  /*************************** Apply filter global  **************************/
  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }

  
  /***************************************************   Apply filter   *******************************************************/
  applyFilterr(event: Event, key: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.filterPredicate = (data, filter) => {
      return data[key].trim().toLowerCase().indexOf(filter) !== -1;
    };
  }

  /*************************************************  Api pour récupérer la liset des employées ************************************************/
loadEmployes() {
  this.equipmentService.getResources().subscribe((data: Employee[]) => {
    this.employees = data;
    console.log("Employees data", data);
  });
}


getEmployeeName(employeeId: number): string {
  const employee = this.employees.find(emp => emp.id === employeeId);
  if (employee) {
    return `${employee.firstName} ${employee.lastName}`;
  }
  return '';
}


setEquipment(id_equipement:any , id_employé:any){
  console.log("yy : "+ id_equipement + "=> ttt : " + id_employé);
  
}
/**************************************************** statistiques *************************************/
getAllAvailableAff(): void {
  this.equipmentService.getAllAvailableAff().subscribe(
    (response: any) => {
      this.availableCount = response;
    },
    (error: any) => {
      console.error('Erreur lors de la récupération du nombre des équipements disponibles et affectables:', error);
    }
  );
}
getAllUnavailableAff(): void {
  this.equipmentService.getAllUnavailableAff().subscribe(
    (response: any) => {
      this.unavailableCount = response;
    },
    (error: any) => {
      console.error('Erreur lors de la récupération du nombre des équipements indisponibles et affectables:', error);
    }
  );
}
getAllAffected(): void {
  this.equipmentService.getAllAffected().subscribe(
    (response: any) => {
      this.affectedCount = response;
    },
    (error: any) => {
      console.error('Erreur lors de la récupération du nombre des équipements affectés :', error);
    }
  );
}
getAllUnaffected(): void {
  this.equipmentService.getAllUnaffected().subscribe(
    (response: any) => {
      this.unaffectedCount = response;
    },
    (error: any) => {
      console.error('Erreur lors de la récupération du nombre des équipements non affectés :', error);
    }
  );
}
}
