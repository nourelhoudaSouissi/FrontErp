import { filter } from 'rxjs/operators';
import { EndorsementService } from './../endorsement.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CreateEndorsementComponent } from './create-endorsement/create-endorsement.component';



@Component({
  selector: 'app-endorsement-list',
  templateUrl: './endorsement-list.component.html',
  styleUrls: ['./endorsement-list.component.scss']
})
export class EndorsementListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  acceptedCount: number;
  refusedCount: number;
  pendingCount: number;
  sentCount: number;
  expiredCount: number;
  public dataSource: any;
  public displayedColumns: any;
  public getItemSub: Subscription;
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private endorsementService: EndorsementService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) { }

  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems();
    this.getAllSentCount();
    this.getAllAccepetedCount();
    this.getAllRefusedCount();
    this.getAllPendingCount();
    this.getAllExpiredCount();

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
    return ['reference','title','endorsementDate','validityDate', 'status','actions'];
  }

  getItems() {    
    this.getItemSub = this.endorsementService.getEndorsements()
      .subscribe(data => {
        data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Ajouter un nouvel avenant' : 'Modifier avenant';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CreateEndorsementComponent, {
      width: '720px',
      height:'600px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        if (isNew) {
          this.loader.open('Ajouter  nouvel Avenant');
          this.endorsementService.addEndorsement(res)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Avenant Ajouté avec succès!', 'OK', { duration: 4000 })
              this.getItems()
            })
        } else {
          this.loader.open('Modifier Avenant ');
          this.endorsementService.updateEndorsement(data.id, res)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.getItems();
              this.snack.open('Avenant Modifié!', 'OK', { duration: 4000 })
            })
        }
      })
  }


  
  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Supprimper  Avenant');
          this.endorsementService.deleteEndorsement(row)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.getItems();
              this.snack.open('Avenant  Supprimé!', 'OK', { duration: 4000 })
            })
        }
      })
  }

  /****************************************  get ColorStatus ********************************************/
  getStatusColor(status: string): { color: string, displayText: string } {

    const STATUS_DATA = {
      ACCEPTED: { color: 'purple', displayText: 'Accepté' },
      SENT: { color: 'primary', displayText: 'Envoyé' },
      REFUSED: { color: 'red', displayText: 'Refusé' },
      STILL_PENDING: { color: 'grey', displayText: 'en cours' },
      EXPIRED: { color: 'green', displayText: 'Expiré' }
    };
    
    
    
    
    return status ? STATUS_DATA[status] :  { color: 'yellow', displayText: 'null ' };


  }
  /**********************************************  change endorsement status    *************************************************/
  changeStatus(status: string, endorsementId: number): void {
    let updateObservable: Observable<any>;
  
    switch (status) {
      case 'Status.SENT':
        updateObservable = this.endorsementService.updateToSentById(endorsementId);
        break;
      case 'Status.ACCEPTED':
        updateObservable = this.endorsementService.updateToAcceptedById(endorsementId);
        break;
      case 'Status.REFUSED':
        updateObservable = this.endorsementService.updateToRefusedById(endorsementId);
        break;
        case 'Status.EXPIRED':
          updateObservable = this.endorsementService.updateToExpiredById(endorsementId);
          break;
    
    }
  
    if (updateObservable) {
      updateObservable.subscribe(
        () => {
          console.log('Statut mis à jour avec succès');
          this.getItems();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du statut', error);
        }
      );
    }
  }
  /************************************** statistiques **************************************/
getAllSentCount(): void {
  this.endorsementService.getAllSent().subscribe(
    (response: any) => {
      this.sentCount = response;
    },
    (error: any) => {
      console.error('Erreur lors de la récupération du nombre de commentaires :', error);
    }
  );
}


getAllAccepetedCount(): void {
  this.endorsementService.getAllAccepted().subscribe(
    (response: any) => {
      this.acceptedCount = response;
    },
    (error: any) => {
      console.error('Erreur lors de la récupération du nombre de commentaires :', error);
    }
  );
}

getAllRefusedCount(): void {
  this.endorsementService.getAllRefused().subscribe(
    (response: any) => {
      this.refusedCount = response;
    },
    (error: any) => {
      console.error('Erreur lors de la récupération du nombre de commentaires :', error);
    }
  );
}

getAllPendingCount(): void {
  this.endorsementService.getAllPending().subscribe(
    (response: any) => {
      this.pendingCount = response;
    },
    (error: any) => {
      console.error('Erreur lors de la récupération du nombre de commentaires :', error);
    }
  );
}

getAllExpiredCount(): void {
  this.endorsementService.getAllExpired().subscribe(
    (response: any) => {
      this.expiredCount = response;
    },
    (error: any) => {
      console.error('Erreur lors de la récupération du nombre de commentaires :', error);
    }
  );
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
/*************************** Apply filter global  **************************/
    applyFilter(event :Event){
      const FilterValue = (event.target as HTMLInputElement).value ;
       this.dataSource.filter = FilterValue.trim().toLowerCase();
   
   }
/****************************  Expiré test **********************************/


}
