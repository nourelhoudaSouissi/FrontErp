import { EndorsementService } from './../endorsement.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { CreateEndorsementComponent } from './create-endorsement/create-endorsement.component';
import { endorsementClient } from 'app/shared/models/endorsementClient';
import { ContractClientService } from '../../contractProjet/contract-client.service';
import { contractClient } from 'app/shared/models/contractClient';
import { egretAnimations } from 'app/shared/animations/egret-animations';


@Component({
  selector: 'app-endorsement-list',
  templateUrl: './endorsement-list.component.html',
  animations: egretAnimations,
  styleUrls: ['./endorsement-list.component.scss']
})
export class EndorsementListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  public dataSource: any;
  public displayedColumns: any;
  public getItemSub: Subscription;
  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private endorsementService: EndorsementService,
    private contractService: ContractClientService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) { }

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
    return ['refContract','reference','title','endorsementDate' ,'actions'];
  }

  getItems() {    
    this.getItemSub = this.endorsementService.getEndorsements()
      .subscribe(data => {
        this.dataSource = new MatTableDataSource<endorsementClient>(data);
        data.forEach((end: endorsementClient) => {
          this.contractService.getItem(end.contractId).subscribe(
            (contract: contractClient) => {
              end.refContract = contract.reference // Assuming the requirement model has a 'title' property
          })
        })
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource)
      })
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Nouvel avenant' : 'Mettre à jour avenant';
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
          this.loader.open('Nouvel Avenant');
          this.endorsementService.addEndorsement(res)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Avenant Ajouté avec succès !', 'OK', { duration: 4000 })
              this.getItems()
            })
        } else {
          this.loader.open('Modifier Avenant ');
          this.endorsementService.updateEndorsement(data.id, res)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.getItems();
              this.snack.open('Avenant Modifié !', 'OK', { duration: 4000 })
            })
        }
      })
  }


  
  deleteItem(row) {
    this.confirmService.confirm({message: `Supprimer ${row.title}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Supprimer avenant');
          this.endorsementService.deleteEndorsement(row.id)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.getItems();
              this.snack.open('Avenant supprimé!', 'OK', { duration: 4000 })
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

}
