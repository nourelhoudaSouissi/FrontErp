import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryCollection, TreasuryType, Tresorerie } from 'app/shared/models/tresorerie.model';
import { ClientService } from 'app/views/client/client.service';
import { InvoiceClient, InvoiceEtat } from 'app/shared/models/invoiceClient.model';
import { TresorerieService } from '../../tresorerie.service';
import { Rapprochement, RapprochementEtat } from 'app/shared/models/rapprochement.model';
import { RapprochementService } from 'app/views/rapprochement/rapprochement.service';

@Component({
  selector: 'app-encaissement-pop-up',
  templateUrl: './encaissement-pop-up.component.html',
  styleUrls: ['./encaissement-pop-up.component.scss']
})
export class EncaissementPopUpComponent implements OnInit {
  encaissementForm: FormGroup;
  listInvoiceClient: InvoiceClient[] = [];
  listRapprochement: Rapprochement[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EncaissementPopUpComponent>,
    private fb: FormBuilder,
    private crudService: TresorerieService,
    private dialog: MatDialog,
    private billService: ClientService,
    private rapprochementService: RapprochementService
  ) {}

  ngOnInit() {
    this.buildEncaissementForm(this.data.payload);
    this.getInvoiceClient();
  }

  submit() {
    this.dialogRef.close(this.encaissementForm.value);
  }

  get categoryList(): CategoryCollection[] {
    return Object.values(CategoryCollection);
  }


  buildEncaissementForm(decaissement?: Tresorerie) {
    this.encaissementForm = this.fb.group({
      category: [decaissement?.categoryCollection || '', Validators.required],
      billClientId: [
        decaissement ? decaissement.billClientId : (this.data && this.data.billClientId) ? this.data.billClientId : null,
        Validators.required
      ],
      date: [decaissement?.date || '', Validators.required],
      description: [decaissement?.description || '', Validators.required],
      treasuryType: [{ value: TreasuryType.En_COURS, disabled: true }, Validators.required],
      bankReconciliation: this.fb.group({
        company: ['', Validators.required],
        bankNumber: [decaissement?.bankReconciliation?.bankNumber || ''],
        issueDate: [decaissement?.bankReconciliation?.issueDate || ''],
        iban: [decaissement?.bankReconciliation?.iban || ''],
        completionDate: [decaissement?.bankReconciliation?.completionDate || ''],
        rapprochementEtat: [decaissement?.bankReconciliation?.rapprochementEtat || RapprochementEtat.NON_RAPPROCHÉ]
      })
    });
  
    // Initialiser rapprochementEtat à NON_RAPPROCHÉ si decaissement est null
    if (!decaissement) {
      this.encaissementForm.get('bankReconciliation.rapprochementEtat').setValue(RapprochementEtat.NON_RAPPROCHÉ);
    }
  }
  closeDialog() {
    this.dialog.closeAll();
  }

  showDiv = false;
  toggleDiv() {
    this.showDiv = !this.showDiv;
  }

  getInvoiceClient() {
    this.billService.getInvoiceClientList().subscribe((data: InvoiceClient[]) => {
      this.listInvoiceClient = data;
      // Modifier invoiceEtat à "En_COURS"
      this.listInvoiceClient.forEach((invoiceClient: InvoiceClient) => {
        if (invoiceClient.id === this.encaissementForm.value.billClientId) {
          invoiceClient.invoiceEtat = InvoiceEtat.En_COURS;
        }
      });
    });
  }



  
}
