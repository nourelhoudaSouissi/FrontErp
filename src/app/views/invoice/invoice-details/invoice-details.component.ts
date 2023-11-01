import { Subscription } from 'rxjs';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { DOCUMENT } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { Currency, CurrencyEnum, Invoice, InvoiceAdditionalFees, InvoiceEtat, InvoiceType, PaymentMethod } from 'app/shared/models/invoice.model';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceDetailsComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource([]);

  currencyForm: FormGroup;
  currencies: Currency[] = Object.keys(CurrencyEnum).map(key => ({
    shortName: key,
    name: CurrencyEnum[key],
    description: ''
  }));
  invoiceEtat: string[] = Object.values(InvoiceEtat);
  invoiceType: string[] = Object.values(InvoiceType);
  paymentMethod: string[] = Object.values(PaymentMethod);

  selected: any = 'Client';
  total = 0;
  vat = 0;
  showEditOption = false;
  isLoading = false;
  invoiceForm: FormGroup;
  invoiceFormSub: Subscription;
  invocieId: number;
  invoice: Invoice = {
    additionalFees: [],
  };

  emptyFormObject: InvoiceAdditionalFees = {
    designation: '',
    refFree: '',
    unite: '',
    tva: null,
    quantity: null,
    cost: null,
    priceWithAllTaxIncluded: 0,
    priceWithoutTax: 0
  };

  AdditionalFeesTableColumns: string[] = [
    'number',
    'designation',
    'description',
    'unite',
    'cost',
    'quantity',
    'tva',
    'priceWithoutTax',
    'priceWithAllTaxIncluded'
  ];

  constructor(
    private confirmService: AppConfirmService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.invocieId = this.route.snapshot.params['id'];
    if (this.invocieId) {
      this.getInvoice();
      this.showEditOption = false;
    } else {
      this.buildInvoiceForm();
      this.showEditOption = true;
    }

    // Add class for print media check _invoice.scss
    this.document.body.classList.add('print-body-content');
  }

  ngOnDestroy() {
    this.document.body.classList.remove('print-body-content');
  }

  getInvoice() {
    this.invoiceService.getInvoiceById(this.invocieId).subscribe((invoice: Invoice) => {
      this.invoice = invoice;
      this.buildInvoiceForm(this.invoice);
      this.cdr.markForCheck();
    });
  }

  imageUrl: string;

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.invoiceForm.patchValue({
        logo: reader.result as string
      });
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  buildInvoiceForm(invoice?: Invoice) {
    this.invoiceForm = this.fb.group({
      id: [invoice ? invoice.id : ''],
      invoiceNumber: [invoice ? invoice.invoiceNumber : ''],
      paymentMethod: [invoice ? invoice.paymentMethod : PaymentMethod],
      orderNumber: [invoice ? invoice.orderNumber : ''],
      invoiceEtat: [invoice ? invoice.invoiceEtat : InvoiceEtat.EN_ATTENTE],
      invoiceType: [invoice ? invoice.invoiceType : InvoiceType],
      date: [invoice ? new Date(invoice.date) : new Date()],
      dueDate: [invoice ? new Date(invoice.dueDate) : ''],
      issueDate: [invoice ? new Date(invoice.issueDate) : ''],
      currency: [invoice ? invoice.currency : ''],
      nameSeller: [invoice ? invoice.nameSeller : ''],
      addressSeller: [invoice ? invoice.addressSeller : ''],
      nameBuyer: [invoice ? invoice.nameBuyer : 'csi digital'],
      addressBuyer: [invoice ? invoice.addressBuyer : 'Bizerte'],
      totalAmount: [invoice ? invoice.totalAmount : 0],
      totalDiscount: [invoice ? invoice.totalDiscount : 0],
      totalWithDiscount: [invoice ? invoice.totalWithDiscount : 0],
      additionalFees: this.fb.array(
        (invoice?.additionalFees || []).map(fees => this.fb.group({
          refFree: [fees.refFree || ''],
          designation: [fees.designation || ''],
          unite: [fees.unite || ''],
          cost: [fees.cost || 0],
          discount: [fees.discount || 0],
          quantity: [fees.quantity || 0],
          tva: [fees.tva || 0],
          priceWithoutTax: [fees.priceWithoutTax || 0],
          priceWithAllTaxIncluded: [fees.priceWithAllTaxIncluded || 0]
        }))
      )
    });
  }

  addNewAdditionalFees(additionalFees?: InvoiceAdditionalFees) {
    this.getAdditionalFeesFormArray().push(
      this.fb.group({
        refFree: [additionalFees ? additionalFees.refFree : ''],
        designation: [additionalFees ? additionalFees.designation : ''],
        unite: [additionalFees ? additionalFees.unite : ''],
        cost: [additionalFees ? additionalFees.cost : ''],
        quantity: [additionalFees ? additionalFees.quantity : ''],
        tva: [additionalFees ? additionalFees.tva : ''],
        discount: [additionalFees ? additionalFees.discount : ''],
        priceWithoutTax: [additionalFees ? additionalFees.priceWithoutTax : ''],
        priceWithAllTaxIncluded: [additionalFees ? additionalFees.priceWithAllTaxIncluded : '']
      })
    );
  }

  getAdditionalFeesFormArray(): FormArray {
    return this.invoiceForm.get('additionalFees') as FormArray;
  }

  deleteAdditionalFeesFromInvoice(index: number) {
    this.confirmService
      .confirm({ title: 'Confirmer', message: 'Voulez-vous supprimer ce frais?' })
      .subscribe(res => {
        if (res) {
          this.getAdditionalFeesFormArray().removeAt(index);
        } else {
          return;
        }
      });
  }

  saveInvoice() {
    if (this.invoiceForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.invoice && this.invoice.id) {
      // Update existing invoice
      this.invoiceService.updateInvoice(this.invoice.id, this.invoiceForm.value)
        .subscribe(
          (res: Invoice) => {
            this.invoice = res;
            this.isLoading = false;
            this.showEditOption = false;
            this.cdr.markForCheck();
          },
          (error: any) => {
            // Handle update error
            this.isLoading = false;
            console.error('Update invoice error:', error);
            // Show alert error
            alert('Veuillez vérifier le remplissage des données ou vérifier si une facture similaire existe déjà dans le processus decaissement.');
            // Additional error handling logic
          }
        );
    } else {
      // Save new invoice
      this.invoiceService.saveInvoice(this.invoiceForm.value)
        .subscribe(
          (res: Invoice) => {
            this.invoice = res;
            this.isLoading = false;
            this.showEditOption = false;
            this.cdr.markForCheck();
            if (res) {
              this.router.navigateByUrl('/invoice/' + res.id);
            }
          },
          (error: any) => {
            // Handle save error
            this.isLoading = false;
            console.error('Save invoice error:', error);
            // Show alert error
            alert('Veuillez vérifier le remplissage des données ou vérifier si un numéro de facture similaire existe déjà.');
            // Additional error handling logic
          }
        );
    }
  }

  print() {
    window.print();
  }

  get invoiceAdditionalFeesFormArray(): FormArray {
    return this.invoiceForm.get('additionalFees') as FormArray;
  }

  get totalAmount() {
    let sum = 0;
    this.invoiceAdditionalFeesFormArray.controls.forEach((additionalFees: FormGroup) => {
      sum += (additionalFees.get('cost').value * additionalFees.get('quantity').value) * ((additionalFees.get('tva').value / 100) + 1);
    });
    return sum;
  }

  get totalDiscount() {
    let sum = 0;
    this.invoiceAdditionalFeesFormArray.controls.forEach((additionalFees: FormGroup) => {
      sum +=
        (additionalFees.get('cost').value * additionalFees.get('quantity').value) *
        ((additionalFees.get('tva').value / 100) + 1);
    });
    const totalWithoutDiscount = sum;
    const discount = this.invoiceForm.get('totalDiscount').value;
    const totalDiscount = totalWithoutDiscount * (discount / 100);
    return totalDiscount.toFixed(3);
  }

  get totalWithDiscount() {
    let sum = 0;
    this.invoiceAdditionalFeesFormArray.controls.forEach((additionalFees: FormGroup) => {
      sum += (additionalFees.get('cost').value * additionalFees.get('quantity').value) * ((additionalFees.get('tva').value / 100) + 1);
    });
    const totalWithoutDiscount = sum;
    const discount = this.invoiceForm.get('totalDiscount').value;
    const totalWithDiscount = totalWithoutDiscount - (totalWithoutDiscount * (discount / 100));
    return totalWithDiscount.toFixed(3);
  }

  onFileSelected(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader.result);
        this.invoiceForm.patchValue({
          logo: reader.result
        });
        console.log(this.invoiceForm);
      };
    }
  }
}
