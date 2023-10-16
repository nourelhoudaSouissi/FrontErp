import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { MatTableDataSource } from '@angular/material/table';
import { contract } from 'app/shared/models/contract';
import { ContractStatus } from 'app/shared/models/contract';
import { Observable } from 'rxjs-compat';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ContractClientService } from '../contract-client.service';
import { ContractClientType, contractClient } from 'app/shared/models/contractClient';
import { egretAnimations } from 'app/shared/animations/egret-animations';


@Component({
  selector: 'app-liste-contract',
  templateUrl: './liste-contract.component.html',
  animations: egretAnimations,
  styleUrls: ['./liste-contract.component.scss']
})
export class ListeContractComponent implements OnInit {

  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  public dataSource:MatTableDataSource<contractClient>;
  public displayedColumns: any;
  public getItemSub: Subscription;

  
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private contractClientService: ContractClientService ,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) {   this.dataSource = new MatTableDataSource<contractClient>([]);}

  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems();
   
    
   
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
    return ['reference', 'titleContract','dateContract', 'contractType','contractStatus','actions'];
  }
  
  getItems() {    
    this.getItemSub = this.contractClientService.getItems()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }


/****************************************  get ColorStatus ********************************************/
  getStatusColor(contractStatus: string): { color: string, displayText: string } {

    const STATUS_DATA = {
      ACCEPTED: { color: 'purple', displayText: 'Accepté' },
      SENT : { color:'primary', displayText: 'Envoyé' },
      REFUSED: { color: 'red', displayText: 'Refusé' },
      STILL_PENDING: { color: 'grey', displayText: 'en cours' }
    };
    
    
    
    
    return contractStatus ? STATUS_DATA[contractStatus] :  { color: 'yellow', displayText: 'null ' };


  }
  /**********************************************  change contract status    *************************************************/
  changeContractStatus(contractStatus: string, contractId: number): void {
    let updateObservable: Observable<any>;
  
    switch (contractStatus) {
      case 'ContractStatus.SENT':
        updateObservable = this.contractClientService.updateToSentById(contractId);
        break;
      case 'ContractStatus.ACCEPTED':
        updateObservable = this.contractClientService.updateToAcceptedById(contractId);
        break;
      case 'ContractStatus.REFUSED':
        updateObservable = this.contractClientService.updateToRefusedById(contractId);
        break;
      default:
        // Cas de statut de contrat non géré
        console.error('Statut de contrat non géré');
        return;
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
  /******************************************* le redirection à l'interface de la modification *****************************************************/
  
  redirectToUpdateClientContract(data:any) {
    this.router.navigate(["/updateContractClient/update-client-contract"], { state: { row: data } });
  }
  
  
 


  /************************************************ delete contract    ***********************************************************/
  deleteItem(row) {
    
    this.confirmService.confirm({message: `Voulez vous supprimer ce contrat?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('supprimer contrat');
          this.contractClientService.deleteItem(row.id)
          .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Contrat  supprimé!', 'OK', { duration: 4000 })
              this.getItems();
            })
        }
      })
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
  

  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }


  ContractClientMap = {
    [ContractClientType.CONTRACT_COSTUMER]: 'Contrat client',
    [ContractClientType.CONTRACT_SUPPLIER]: 'Contrat fournisseur'
  
  };
}
