import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Rapprochement, RapprochementEtat } from 'app/shared/models/rapprochement.model';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { PopUpRapprochementComponent } from '../pop-up-rapprochement/pop-up-rapprochement.component';
import { RapprochementService } from '../rapprochement.service';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TreasuryType } from 'app/shared/models/Disbursement.model';

@Component({
  selector: 'app-list-rapprochement',
  templateUrl: './list-rapprochement.component.html',
  styleUrls: ['./list-rapprochement.component.scss']
})
export class ListRapprochementComponent implements OnInit {
  displayedColumns: string[] = ['index', 'bankNumber', 'company', 'iban', 'issueDate', 'completionDate', 'action'];
  dataSource = new MatTableDataSource<Rapprochement>([]);
  rapprochementList: Rapprochement[] = [];
  showEditOption = false;
  editedRapprochement: Rapprochement;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  itemsToDisplay: Rapprochement[];

  constructor(
    private tresorerieService: RapprochementService,
    private confirmService: AppConfirmService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private snack: MatSnackBar,
    private route: ActivatedRoute,
  ) { }

  





  ngOnInit() {
    this.getRapprochementList();
  }

  getRapprochementList() {
    this.tresorerieService.getRapprochementList().subscribe((res: Rapprochement[]) => {
      this.rapprochementList = res;
      this.dataSource.data = this.rapprochementList;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.handlePageChange({ pageIndex: 0, pageSize: 10, length: this.rapprochementList.length });
    });
  }

  buildRapprochementForm(rapprochement: Rapprochement) {
    this.showEditOption = true;
    this.editedRapprochement = rapprochement;
  }

  deleteRapprochementById(id: any) {
    this.confirmService
      .confirm({
        title: "Confirmation",
        message: "Voulez-vous supprimer ce rapprochement?"
      })
      .subscribe((result) => {
        if (result === true) {
          this.tresorerieService.deleteRapprochement(id).subscribe((res) => {
            this.rapprochementList = this.rapprochementList.filter((rapprochement) => rapprochement.id !== id);
            this.dataSource.data = this.rapprochementList;
            this.cdr.detectChanges();
            this.handlePageChange({ pageIndex: this.paginator.pageIndex, pageSize: this.paginator.pageSize, length: this.rapprochementList.length });
          });
        }
      });
  }

  isLoading = false;
  rapprochement: Rapprochement;
  rapprochementForm: FormGroup;
  listInvoice: Rapprochement[] = [];

  handlePageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.itemsToDisplay = this.rapprochementList.slice(startIndex, endIndex);
  }

  openPopUp(data: any, isNew?: boolean) {
    let title = isNew ? 'Ajouter un nouveau rapprochement' : 'Modifier un rapprochement';
    let dialogRef: MatDialogRef<any> = this.dialog.open(PopUpRapprochementComponent, {
      width: '50%',
      disableClose: true,
      data: { title: title, payload: data }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        // If user presses cancel
        return;
      }

      if (isNew) {
        this.loader.open('Ajout d\'un nouveau rapprochement');
        if (this.validateForm(res)) {
          this.tresorerieService.saveRapprochement(res).subscribe((data: any) => {
            this.rapprochementList = data;
            this.dataSource.data = this.rapprochementList;
            this.loader.close();
            this.snack.open('Rapprochement ajouté!', 'OK', { duration: 2000 });
            this.getRapprochementList();
          }, error => {
            this.loader.close();
            this.snack.open('Erreur lors de la sauvegarde du rapprochement.', 'OK', { duration: 2000 });
            console.error('Error saving rapprochement:', error);
          });
        } else {
          // Form validation failed, handle error
          // For example, show an error message to the user
          this.loader.close();
          this.snack.open('Veuillez remplir tous les champs obligatoires.', 'OK', { duration: 2000 });
        }
      } else {
        this.loader.open('Modification d\'un rapprochement');
        if (this.validateForm(res)) {
          res.rapprochementEtat = RapprochementEtat.RAPPROCHÉ;

          this.tresorerieService.updateRapprochement(data.id, res).subscribe((data: any) => {
            this.rapprochementList = data;
            this.dataSource.data = this.rapprochementList;
            this.loader.close();
            this.snack.open('Rapprochement modifié!', 'OK', { duration: 2000 });
            this.getRapprochementList();
          }, error => {
            this.loader.close();
            this.snack.open('Erreur lors de la mise à jour du rapprochement.', 'OK', { duration: 2000 });
            console.error('Error updating rapprochement:', error);
          });
        } else {
          // Form validation failed, handle error
          // For example, show an error message to the user
          this.loader.close();
          this.snack.open('Veuillez remplir tous les champs obligatoires.', 'OK', { duration: 2000 });
        }
      }
    });
  }

  validateForm(formValue: any): boolean {
    if (
      formValue.bankNumber &&
      formValue.company &&
      formValue.iban &&
      formValue.issueDate
    ) {
      return true;
    } else {
      return false;
    }
  }


}
