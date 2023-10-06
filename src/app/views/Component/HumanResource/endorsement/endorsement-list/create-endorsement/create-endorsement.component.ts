import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EndorsementService } from '../../endorsement.service';
import { ContractEmployeeService } from '../../../contracts/contractEmployee/contract-employee.service';
import { contract } from 'app/shared/models/contract';

@Component({
  selector: 'app-create-endorsement',
  templateUrl: './create-endorsement.component.html',
  styleUrls: ['./create-endorsement.component.scss']
})
export class CreateEndorsementComponent implements OnInit {
  contracts: contract[] = [];
  public itemForm: FormGroup;

  formErrorMessages = {
    title: 'Le titre est requis',
    endorsementDate: "La date de l'avenant est requise",
    object: "L'objet est requis",
    note: 'La note est requise',
    validityDate: 'La date de validité est requise'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateEndorsementComponent>,
    private fb: FormBuilder,
    private contractService: ContractEmployeeService
  ) {}

  ngOnInit() {
    this.buildItemForm(this.data.payload);
    this.loadContracts();
  }

  buildItemForm(item) {
    this.itemForm = this.fb.group({
      contractNum: [item.contractNum || ''],
      title: [item.title || '', Validators.required],
      endorsementDate: [item.endorsementDate || '', Validators.required],
      object: [item.object || '', Validators.required],
      reference: [item.reference ],
      note: [item.note || '', Validators.required],
      validityDate: [item.validityDate || '', Validators.required]
    });
  }

  loadContracts() {
    this.contractService.getAllItemsAccepted().subscribe((data: contract[]) => {
      this.contracts = data;
      console.log('Contracts data', data);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submit() {
    if (this.itemForm.valid) {
      this.dialogRef.close(this.itemForm.value);
    } else {
      // Mark all the form controls as touched to display the validation messages
      this.markFormGroupTouched(this.itemForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    // Recursively mark all form controls as touched to trigger the validation
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
