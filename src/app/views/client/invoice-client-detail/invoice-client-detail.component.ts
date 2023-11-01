import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Currency, CurrencyEnum, FeeClients, InvoiceClient, InvoiceEtat, InvoiceType, PaymentMethod } from 'app/shared/models/invoiceClient.model';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { Subscription } from 'rxjs';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-invoice-client-detail',
  templateUrl: './invoice-client-detail.component.html',
  styleUrls: ['./invoice-client-detail.component.scss']
})
export class InvoiceClientDetailComponent implements OnInit {

  dataSource = new MatTableDataSource([]);
  invoiceEtat :string []= Object.values(InvoiceEtat);
  invoiceType :string []= Object.values(InvoiceType);
  paymentMethod :string []= Object.values(PaymentMethod);
  selectedValue: string;
  showOptions: boolean = false;
  total = 0;
  vat = 0;
  showEditOption = false;
  isLoading = false;
  invoiceForm: UntypedFormGroup;
  invoiceFormSub: Subscription;
  invocieId: number;
  invoice: InvoiceClient = {
    feeClients: [],
  };
client : InvoiceClient[];
  emptyFormObject: FeeClients = {
    designation: '',
    refFree: '',
    unite: '',
    tva: null,
    quantity: null,
    cost: null,
    priceWithAllTaxIncluded: 0,
    priceWithoutTax: 0
  };

  FeeClientsTableColumns: string[] = [
    'number',
    'designation',
    'quantity',
    'unite',
    'cost',
    'discount',
    'tva',
    'priceWithoutTax',
    'priceWithAllTaxIncluded'
  ];
  

  constructor(

    private confirmService: AppConfirmService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: ClientService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) { }

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
    this.invoiceService.getInvoiceClientById(this.invocieId).subscribe((invoice: InvoiceClient) => {
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
  
  

  buildInvoiceForm(invoice?: InvoiceClient) {
    this.invoiceForm = this.fb.group({
      id: [invoice ? invoice.id : ''],
      invoiceNumber: [invoice ? invoice.invoiceNumber : ''],
      paymentMethod: [invoice ? invoice.paymentMethod : PaymentMethod ],
      orderNumber: [invoice ? invoice.orderNumber : ''],
      invoiceEtat: invoice ? invoice.invoiceEtat : InvoiceEtat.EN_ATTENTE,
      invoiceType: invoice ? invoice.invoiceType : InvoiceType,
      date: invoice ? new Date(invoice.date) : new Date(),
      dueDate: invoice ? new Date(invoice.dueDate) : '',
      currency: invoice ? invoice.currency : '',
      nameSeller: [invoice ? invoice.nameSeller : 'csi digital'],
      addressSeller: [invoice ? invoice.addressSeller : 'Bizerte'],      
      nameBuyer: [invoice ? invoice.nameBuyer : ''],
      addressBuyer: [invoice ? invoice.addressBuyer : ''],
      totalAmount: [invoice ? invoice.totalAmount : 0],
      totalWithDiscount: [invoice ? invoice.totalWithDiscount : 0],
      totalDiscount: [invoice ? invoice.totalDiscount : 0],
      logo: [this.imageUrl || (invoice ? invoice.logo : '')], 
      feeClients: this.fb.array(
        (invoice?.feeClients || []).map(fees => this.fb.group({
          refFree: [fees.refFree || ''],
          designation: [fees.designation || ''],
          unite: [fees.unite || ''],
          cost: [fees.cost || 0],
          quantity: [fees.quantity || 0],
          discount: [fees.discount || 0],
          tva: [fees.tva || 0],
          priceWithoutTax: [fees.priceWithoutTax || 0],
          priceWithAllTaxIncluded: [fees.priceWithAllTaxIncluded || 0]
        }))
      )
    });

  }


  addNewFeeClients(feeClients?: FeeClients) {
    this.getFeeClientsFormArray().push(
      this.fb.group({
        refFree: [feeClients ? feeClients.refFree : ''],
        designation: [feeClients ? feeClients.designation : ''],
        unite: [feeClients ? feeClients.unite : ''],
        cost: [feeClients ? feeClients.cost : ''],
        quantity: [feeClients ? feeClients.quantity : ''],
        tva: [feeClients ? feeClients.tva : ''],
        discount: [feeClients ? feeClients.discount : 0],
        priceWithoutTax: [feeClients ? feeClients.priceWithoutTax : ''],
        priceWithAllTaxIncluded: [feeClients ? feeClients.priceWithAllTaxIncluded : '']
      })
    );
  }
  
  getFeeClientsFormArray(): FormArray {
    return this.invoiceForm.get('feeClients') as FormArray;
  }
  

  deleteFeeClientsFromInvoice(index: number) {
    this.confirmService
      .confirm({ title: "Confirmer", message: "Voulez-vous supprimer ce frais?" })
      .subscribe(res => {
        if (res) {
          this.getFeeClientsFormArray().removeAt(index);
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
      this.invoiceService.updateInvoiceClient(this.invoice.id, this.invoiceForm.value)
        .subscribe( 
          (res: InvoiceClient) => {
            
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
            alert('Veuillez vérifier le remplissage des données ou vérifier si une facture similaire existe déjà dans le processus encaissement.');
            // Additional error handling logic
          }
        );
    } else {
      // Save new invoice
      this.invoiceService.saveInvoiceClient(this.invoiceForm.value)
        .subscribe(
          (res: InvoiceClient) => {
            this.invoice = res;
            this.isLoading = false;
            this.showEditOption = false;
            this.cdr.markForCheck();
            if (res) {
              this.router.navigateByUrl('/client/' + res.id);
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

  get invoiceFeeClientsFormArray(): FormArray {
    return this.invoiceForm.get('feeClients') as FormArray;
  }

  get totalAmount() {
    let sum = 0;
    this.invoiceFeeClientsFormArray.controls.forEach((feeClients: FormGroup) => {
      sum += (feeClients.get('cost').value * feeClients.get('quantity').value) * ((feeClients.get('tva').value / 100 ) + 1);
    });
    return sum;
  }

  
  
  get totalDiscount() {
    let sum = 0;
    this.invoiceFeeClientsFormArray.controls.forEach((feeClients: FormGroup) => {
      sum +=
        (feeClients.get('cost').value * feeClients.get('quantity').value) *
        ((feeClients.get('tva').value / 100) + 1);
    });
    const totalWithoutDiscount = sum;
    const discount = this.invoiceForm.get('totalDiscount').value;
    const totalDiscount = totalWithoutDiscount * (discount / 100);
    return totalDiscount.toFixed(3);
  }

  get totalWithDiscount() {
    let sum = 0;
    this.invoiceFeeClientsFormArray.controls.forEach((feeClients: FormGroup) => {
      sum += (feeClients.get('cost').value * feeClients.get('quantity').value) * ((feeClients.get('tva').value / 100) + 1);
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
        console.log(reader.result)
        this.invoiceForm.patchValue({
          logo: reader.result
        });
        console.log(this.invoiceForm)
      };
    }
  }


  currencyForm: FormGroup;
  currencies: Currency[] = Object.keys(CurrencyEnum).map(key => ({
    shortName: key,
    name: CurrencyEnum[key],
    description: ''
  }));
  


}



