import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Quotation, QuotationStatus } from 'app/shared/models/Quotation';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Observable, Subscription } from 'rxjs';
import { QuotationPopComponent } from '../quotation-pop/quotation-pop.component';
import { QuotationService } from '../quotation.service';
import { ReqService } from '../../Requirement/req.service';
import { req } from 'app/shared/models/req';
import { Partner } from 'app/shared/models/Partner';
import { CrudPartnerService } from '../../partner/crudPartner.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  animations: egretAnimations,
  styleUrls: ['./quotation-list.component.scss']
})
export class QuotationListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource: MatTableDataSource<Quotation>;
  public displayedColumns: any;
  public getItemSub: Subscription;

  partnerId : number
  allPartners: Partner[] = [];

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private quotationService: QuotationService,
    private reqService: ReqService,
    private partnerService : CrudPartnerService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
  ) {
    this.dataSource = new MatTableDataSource<Quotation>([]);
  }

  ngOnInit(): void {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()
  }

  getDisplayedColumns() {
    return [
      'ref', 'requirementTitle','partnerName', 'quotationStatus','actions'
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
    this.getItemSub = this.quotationService.getQuotations()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource<Quotation>(data);
        // Fetch requirement title for each quotation
        data.forEach((quotation: Quotation) => {
          this.reqService.getItem(quotation.requirementId).subscribe(
            (requirement: req) => {
              quotation.requirementTitle = requirement.title // Assuming the requirement model has a 'title' property
              quotation.partnerId = requirement.partnerId
              this.partnerId = requirement.partnerId
              // Fetch the partner name using the 'partnerId' property
              this.partnerService.getItem(quotation.partnerId).subscribe(
            (partner: any) => {
              quotation.partnerName = partner.name; // Assuming the partner model has a 'name' property
            },
            (error: any) => {
              console.error('Error fetching partner:', error);
            }
          );
            },
            (error: any) => {
              console.error('Error fetching requirement:', error);
            }
          );
        });
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource)
      })

  }


  deleteItem(row) {
    this.confirmService.confirm({message: `Supprimer devis : ${row.ref}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Suppression devis en cours');
          this.quotationService.deleteQuotation(row.id)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Devis supprimé !', 'OK', { duration: 2000 });
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
  let title = isNew ? 'Ajouter devis' : 'Mettre à jour devis';
  let titleP = isNew ? 'Ajouter Les profils' : 'Mettre à jour les profils';
  let dialogRef: MatDialogRef<any> = this.dialog.open(QuotationPopComponent, {
    height: '620px',
    width: '920px',
    disableClose: true,
    data: { title: title, payload: data , isNew: isNew, titleP: titleP}
  })
  dialogRef.afterClosed()
    .subscribe(res => {
      if(!res) {
        // If user press cancel
        return;
      }
      if (isNew) {
        this.loader.open('Ajout devis en cours');
        this.quotationService.addQuotation(res)
          .subscribe((data :any)=> {
            this.dataSource = data;
            this.loader.close();
            this.snack.open('Devis ajoutée avec succès !', 'OK', { duration: 2000 });
            this.getItems();
          })
      } else {
        this.loader.open('Mise à jour devis');
        this.quotationService.updateQuotation(data.id, res)
          .subscribe((data:any) => {
            this.dataSource = data ;
            this.loader.close();
            this.snack.open('Devis mise à jour !', 'OK', { duration: 2000 });
            this.getItems();
          })
      }
    })
}

changeQuotationStatus(quotationStatus: string, reqId: number): void {
  console.log('Changing req status to:', quotationStatus);
  let updateObservable: Observable<any>;
  switch (quotationStatus) {
    case 'quotationStatus.ACCEPTED':
      updateObservable = this.quotationService.updateStatusToAccepted(reqId);
      break;
    case 'quotationStatus.IN_PROGRESS':
      updateObservable = this.quotationService.updateStatusToInProgress(reqId);
      break;
    case 'quotationStatus.REFUSED':
      updateObservable = this.quotationService.updateStatusToRefused(reqId);
      break;
    case 'quotationStatus.UNANSWERED':
      updateObservable = this.quotationService.updateStatusToUnanswered(reqId);
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
    VALIDATED: { color: 'primary', displayText: 'Accepté' },
    IN_PROGRESS: { color: 'primary', displayText: 'En attente' },
    REFUSED: { color: 'primary', displayText: 'Refusé' },
    UNANSWERED: { color: 'primary', displayText: 'Sans suite' },
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

  quotationStatusMap = {
    [QuotationStatus.IN_PROGRESS]: "En attente",
    [QuotationStatus.VALIDATED]: "Accepté",
    [QuotationStatus.REFUSED]: "Refusé",
    [QuotationStatus.UNANSWERED]: "Sans suite"
  }

}
