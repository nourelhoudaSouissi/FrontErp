
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service'; 
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service'; 
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReqService } from '../../req.service';
import { Availability, PaymentType, RequirementStatus, RequirementType, WorkField, req } from 'app/shared/models/req';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { ReqpopComponent } from '../../req-pop/reqpop/reqpop.component';
import { ProfilePopComponent } from '../../profile-pop/profile-pop.component';
import { Partner } from 'app/shared/models/Partner';
import { CrudPartnerService } from '../../../partner/crudPartner.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reqlist',
  templateUrl: './reqlist.component.html',
  animations: egretAnimations,
  providers: [DatePipe]
})
export class ReqlistComponent implements OnInit , OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  public dataSource: MatTableDataSource<req>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  reqStatus: string [] = Object.values(RequirementStatus)
 
  partner: Partner

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private ReqService: ReqService,
    private confirmService: AppConfirmService,
    private partnerService: CrudPartnerService,
    private loader: AppLoaderService,
    private datePipe: DatePipe
  ) {     this.dataSource = new MatTableDataSource<req>([]);}

  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()   
  }

  getDisplayedColumns() {
    return [
      'partnerName','ref','title','requirementStatus','availability','responseDate','actions',
    ];
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

  getItems() {    
    this.getItemSub = this.ReqService.getItems()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource<req>(data);
        data.forEach((req: req) => {
          this.partnerService.getItem(req.partnerId).subscribe(
            (partner: Partner) => {
              req.partnerName = partner.name // Assuming the requirement model has a 'title' property
          })
        })
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource)
      })

  }


  deleteItem(row) {
    this.confirmService.confirm({message: `Supprimer l'opportunité ${row.title}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Suppression opportunité en cours');
          this.ReqService.deleteItem(row.id)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Opportunité supprimée !', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
  }

 openPopUp(data:  any , isNew?) {
  let title = isNew ? 'Ajouter opportunité' : 'Mettre à jour opportunité';
  let dialogRef: MatDialogRef<any> = this.dialog.open(ReqpopComponent, {
    height: '620px',
    width: '920px',
    disableClose: true,
    data: { title: title, payload: data , isNew: isNew , fromPartner : false}
  })
  dialogRef.afterClosed()
    .subscribe(res => {
      if(!res) {
        // If user press cancel
        return;
      }
      if (isNew) {
        this.loader.open('Ajout opportunité en cours');
        this.ReqService.addReq(res)
          .subscribe((data :any)=> {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Opportunité ajoutée avec succès !', 'OK', { duration: 2000 });
            this.getItems();
          })
      } else {
        this.loader.open('Mise à jour opportunité');
        this.ReqService.updateReq(data.id, res)
          .subscribe((data:any) => {
            this.dataSource = data ;
            this.loader.close();
            this.snack.open('Opportunité mise à jour !', 'OK', { duration: 2000 });
            this.getItems();
          })
      }
    })
}

/*openPopUp2(requirementId: number) {
  let title = 'Ajouter profil demandé'
  let dialogRef: MatDialogRef<any> = this.dialog.open(ProfilePopComponent, {
    height: '620px',
    width: '720px',
    disableClose: true,
    data: { title: title, payload: {} , requirementNum: requirementId}
  })
  dialogRef.afterClosed()
    .subscribe(res => {
      if(!res) {
        // If user press cancel
        return;
      }
        this.loader.open('Ajout profil demandé en cours');
        console.log(res)
        this.ReqService.addProfile(res)
          .subscribe((data :any)=> {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Profil demandé ajoutée avec succès !', 'OK', { duration: 2000 });
            this.getItems();
          })
      })
    }*/

    changeReqStatus(reqStatus: string, reqId: number): void {
      console.log('Changing req status to:', reqStatus);
      let updateObservable: Observable<any>;
      switch (reqStatus) {
        case 'requirementStatus.OPEN':
          updateObservable = this.ReqService.updateStatusToOpen(reqId);
          break;
        case 'requirementStatus.IN_PROGRESS':
          updateObservable = this.ReqService.updateStatusToInProgress(reqId);
          break;
        case 'requirementStatus.PARTIALLY_WON':
          updateObservable = this.ReqService.updateStatusToPartiallyWon(reqId);
          break;
        case 'requirementStatus.TOTALLY_WON':
          updateObservable = this.ReqService.updateStatusToTotallyWon(reqId);
          break;
          case 'requirementStatus.PARTIALLY_LOST':
            updateObservable = this.ReqService.updateStatusToPartiallyLost(reqId);
            break;
        case 'requirementStatus.TOTALLY_LOST':
          updateObservable = this.ReqService.updateStatusToTotallyLost(reqId);
          break;
        case 'requirementStatus.ABANDONED':
          updateObservable = this.ReqService.updateStatusToAbandoned(reqId);
          break;
        case 'requirementStatus.CLOSED':
          updateObservable = this.ReqService.updateStatusToClosed(reqId);
          break;
       // default:
          //Cas de statut de contrat non géré
          console.error('Statut de candidat non géré');
          return;
      }
      updateObservable.subscribe(
        (data) => {
          // handle success
          console.log('Mise à jour effectuée avec succès');
          this.getItems();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour : ', error);
        }
      );
    }
    getStatusColor(requirementStatus: string): { color: string, displayText: string } {
      const STATUS_DATA = {
        OPEN: { color: 'primary', displayText: 'Ouverte' },
        IN_PROGRESS: { color: 'primary', displayText: 'En progrès' },
        CLOSED: { color: 'red', displayText: 'Clôturée' },
        PARTIALLY_WON: { color: 'primary', displayText: 'Partiellement gagnée' },
        TOTALLY_WON: { color: 'purple', displayText: 'Totalement gagnée' },
        PARTIALLY_LOST : { color:'primary', displayText: 'Partiellement perdue' },
        TOTALLY_LOST : { color:'red', displayText: 'Totalement perdue' },
        ABANDONED: { color: 'red', displayText: 'Abandonnée' }
      };
      return STATUS_DATA[requirementStatus];
  }
    
  ////////////filtrer  par colonne //////////////
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

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  workFieldMap = {
    [WorkField.IT]:'IT',
    [WorkField.INDUSTRY]:'Industrie',
   [WorkField.SALES]:'Ventes',
   [WorkField.AGRICULTURE] :'Agriculture',
   [WorkField.BANKING] :'Banking',
   [WorkField.E_COM] :'E-Commerce',
   [WorkField.ASSURANCE] :'Assurance',
   [WorkField.FINANCE] :'Finance'
  };

  paymentTypeMap = {
    [PaymentType.FOR_SETTLEMENT]:'En régie',
    [PaymentType.IN_PACKAGE]:'En forfait'
  }

  reqTypeMap = {
    [RequirementType.RESOURCE]:'Ressource',
    [RequirementType.PROJECT]:'Projet'
  }

  reqStatusMap = {
    [RequirementStatus.OPEN] :'Ouvert',
    [RequirementStatus.IN_PROGRESS] :'En progrès',
    [RequirementStatus.CLOSED]:'Clôturé',
    [RequirementStatus.PARTIALLY_WON]:'Partiellement gagné',
    [RequirementStatus.TOTALLY_WON]:'Totalement gagné',
    [RequirementStatus.PARTIALLY_LOST]:'Partiellement perdu',
    [RequirementStatus.TOTALLY_LOST] :'Totalement perdu',
    [RequirementStatus.ABANDONED] :'Abandonné',
  }

  availabilityMap = {
    [Availability.ASAP]: "ASAP",
    [Availability.FROM]: "A partir de",
    [Availability.IMMEDIATELY]: "Immédiatement"
  }
}