import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { RapprochementService } from '../rapprochement.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Rapprochement, RapprochementEtat } from 'app/shared/models/rapprochement.model';

@Component({
  selector: 'app-pop-up-rapprochement',
  templateUrl: './pop-up-rapprochement.component.html',
  styleUrls: ['./pop-up-rapprochement.component.scss']
})
export class PopUpRapprochementComponent implements OnInit {
  isLoading = false;
  rapprochement: Rapprochement;
  showEditOption = false;
  rapprochementForm: FormGroup;
  listInvoice: Rapprochement[] = [];
  rapprochementId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopUpRapprochementComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private invoiceService: RapprochementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.rapprochementId = this.route.snapshot.params['id'];
    if (this.rapprochementId) {
      this.getRapprochement();
      this.showEditOption = false;
    } else {
      this.buildRapprochementForm(this.data.payload);
      this.showEditOption = true;
    }
  }

  getRapprochement() {
    this.invoiceService.getRapprochementById(this.rapprochementId).subscribe((rapprochement: Rapprochement) => {
      this.rapprochement = rapprochement;
      this.buildRapprochementForm(this.rapprochement);
      this.cdr.markForCheck();
    });
  }

  submit() {
    this.dialogRef.close(this.rapprochementForm.value);
  }

  buildRapprochementForm(rapprochement?: Rapprochement) {
    this.rapprochementForm = this.fb.group({
      issueDate: [rapprochement?.issueDate || '', Validators.required],
      bankNumber: [rapprochement?.bankNumber || '', Validators.required],
      company: [rapprochement?.company || '', Validators.required],
      iban: [rapprochement?.iban || '', Validators.required],
      rapprochementEtat: [rapprochement?.rapprochementEtat || RapprochementEtat.NON_RAPPROCHÉ]
    });
  }
  

  closeDialog() {
    this.dialogRef.close();
  }
}