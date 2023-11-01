import { Inject, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryDisbursement, Disbursement, TreasuryType } from 'app/shared/models/Disbursement.model';
import { TresorerieService } from '../../tresorerie.service';
import { Invoice, InvoiceEtat } from 'app/shared/models/invoice.model';
import { InvoiceService } from 'app/views/invoice/invoice.service';
import { RapprochementService } from 'app/views/rapprochement/rapprochement.service';
import { Rapprochement, RapprochementEtat } from 'app/shared/models/rapprochement.model';

@Component({
  selector: 'app-decaissement-pop-up',
  templateUrl: './decaissement-pop-up.component.html',
  styleUrls: ['./decaissement-pop-up.component.scss']
})
export class DecaissementPopUpComponent implements OnInit {

  tresorerieType: string[] = Object.values(TreasuryType);

  isLoading = false;
  decaissement: Disbursement ;
  showEditOption = false;
  decaissementForm: FormGroup;
  listInvoice: Invoice[] = [];
  listRapprochement: Rapprochement[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DecaissementPopUpComponent>,
    private fb: FormBuilder,
    private crudService: TresorerieService, 
    private dialog: MatDialog,
    private billService: InvoiceService,
    private rapprochementService: RapprochementService
  ) {}
  
  ngOnInit() {
    this.buildDecaissementForm(this.data.payload);
    this.getInvoice();
    this.getRapprochement();
  }

  submit() {
    this.dialogRef.close(this.decaissementForm.value);
  }

  categoryList: CategoryDisbursement[] = Object.values(CategoryDisbursement);

  buildDecaissementForm(decaissement?: Disbursement) {
    this.decaissementForm = this.fb.group({
      category: [decaissement?.categoryDisbursement || '', Validators.required],
      billId: [decaissement ? decaissement.billId : (this.data && this.data.billId) ? this.data.billId : null, Validators.required],
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
      this.decaissementForm.get('bankReconciliation.rapprochementEtat').setValue(RapprochementEtat.NON_RAPPROCHÉ);
    }
  }
  
  closeDialog() {
    this.dialogRef.close();
  }

  showDiv = false;
  toggleDiv() {
    this.showDiv = !this.showDiv;
  }
  
  getInvoice() {
    this.billService.getInvoiceList().subscribe((data: Invoice[]) => {
      this.listInvoice = data;
      // Modifier invoiceEtat à "En_COURS"
      this.listInvoice.forEach((invoice: Invoice) => {
        if (invoice.id === this.decaissementForm.value.billId) {
          invoice.invoiceEtat = InvoiceEtat.En_COURS;
        }
      });
    });
  }

  getRapprochement() {
    this.rapprochementService.getRapprochementList().subscribe((data: Rapprochement[]) => {
      this.listRapprochement = data;
      // Modifier rapprochementEtat à "En_COURS"
      this.listRapprochement.forEach((rapprochement: Rapprochement) => {
        if (rapprochement.id === this.decaissementForm.value.bankReconciliationId) {
          rapprochement.rapprochementEtat = RapprochementEtat.NON_RAPPROCHÉ;
        }
      });
    });
  }
}
