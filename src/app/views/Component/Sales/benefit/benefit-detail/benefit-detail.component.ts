import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BenefitService } from '../benefit.service';
import { Benefit, BenefitStatus } from 'app/shared/models/Benefit';
import { workArrangement } from 'app/shared/models/workArrangement';
import { extraDuty } from 'app/shared/models/extraDuty';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { ExtraDutyPopComponent } from '../extra-duty-pop/extra-duty-pop.component';
import { WorkArrangementPopComponent } from '../work-arrangement-pop/work-arrangement-pop.component';


@Component({
  selector: 'app-benefit-detail',
  templateUrl: './benefit-detail.component.html'
})
export class BenefitDetailComponent implements OnInit {
  id: number
  benefit: Benefit
  public displayedColumns: any;
  public displayedColumns2: any;
  public dataSource: MatTableDataSource<extraDuty>;
  public dataSource2: MatTableDataSource<workArrangement>;
  public workArrangements: workArrangement[]
  public extraDuties: extraDuty[]

  benefitStatusMap = {
    [BenefitStatus.SIGNED]:'Signé',
    [BenefitStatus.PROVISIONAL]:'Provisoire'
  };

  constructor(private route: ActivatedRoute,
    private benefitService: BenefitService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private loader: AppLoaderService) {
      this.dataSource = new MatTableDataSource<extraDuty>([]);
      this.dataSource2 = new MatTableDataSource<workArrangement>([]);
    }

  getDisplayedColumns() {
    return ['workingHoursNumber','hourWage','performanceBonus', 'extraDutyType', 'actions'];
  }

  getDisplayedColumns2() {
    return ['dailyWage','workingDaysNumber','workModel','actions'];
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['iiid'];
    this.getBenefit();
    this.getExtraDuties();
    this.getWorkArrangements();
    this.displayedColumns= this.getDisplayedColumns();
    this.displayedColumns2=this.getDisplayedColumns2();
    
    console.log(this.id)
  }

  getBenefit(){
    this.benefitService.getItem(this.id).subscribe((data: any) => {
      this.benefit = data;
    })
  }

  getExtraDuties() {
    this.benefitService.getItemExtraDuties(this.id).subscribe((data) => {
        this.dataSource = new MatTableDataSource(data)
    })}

  getWorkArrangements(){
    this.benefitService.getItemWorkArrangements(this.id).subscribe((data) =>{
      this.dataSource2 = new MatTableDataSource(data)
    })
  }

  deleteExtraDuty(id: number) {
    this.benefitService.deleteExtraDuty(id)
      .subscribe(
        response => {
          console.log(response);
          // Reload the addresses list after deletion
          this.getExtraDuties();
        },
        error => {
          console.log(error);
        }
      );
  }
  deleteWorkArrangement(id: number) {
    this.benefitService.deleteWorkArrangement(id)
      .subscribe(
        response => {
          console.log(response);
          // Reload the addresses list after deletion
          this.getWorkArrangements()
        },
        error => {
          console.log(error);
        }
      );
  }
  openPopUp(data: any = {} , isNew?) {
    let title = isNew ? 'Ajouter activité exceptionnelle' : 'Modifier activité exceptionnelle';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ExtraDutyPopComponent, {
      width: '1000px',
      disableClose: true,
      data: { title: title, payload: data , benefitId: this.benefit.id,}
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        if (isNew) {
          this.loader.open('Ajout en cours');
          this.benefitService.addExtraDuty(res)
            .subscribe((data :any)=> {
              this.dataSource = data;
              this.loader.close();
               this.snack.open('Activité exceptionnelle ajoutée avec succès!', 'OK', { duration: 2000 });
               this.getExtraDuties()
            })
        }else {
          this.loader.open('modification en cours');
          this.benefitService.updateExtraDuty(data.id,res)
            .subscribe((data:any) => {
              this.dataSource = data ;
              this.loader.close();
              this.snack.open('Activité exceptionnelle modifiée avec succées !', 'OK', { duration: 2000 });
              this.getExtraDuties();
            })
        } 
      })
  
  }
  openPopUp2(data: any = {}, isNew?) {
    let title = isNew ? 'Nouvelle modalité de travail' : 'Mettre à jour modalité de travail';
    let dialogRef: MatDialogRef<any> = this.dialog.open(WorkArrangementPopComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, payload: data ,  benefitId:this.benefit.id }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        if (isNew) {
          this.loader.open('Ajout en cours');
          this.benefitService.addWorkArrangement(res)
            .subscribe((data:any) => {
              this.dataSource2 = data;
              this.loader.close();
              this.snack.open('Modalité de travail ajoutée avec succès!', 'OK', { duration: 4000 })
              this.getWorkArrangements()
            })
        } else {
          this.loader.open('Mise à jour');
          this.benefitService.updateWorkArrangement(data.id, res)
            .subscribe((data :any) => {
              this.dataSource2 = data;
              this.loader.close();
              this.snack.open('Modalité de travail mise à jour avec succès!', 'OK', { duration: 4000 })
              this.getWorkArrangements();
            })
        }
      })
  }
}



