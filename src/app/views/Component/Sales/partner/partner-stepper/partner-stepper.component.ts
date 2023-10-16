import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CompanyStatus, ControlType, Currency, LegalStatus, PaymentCondition, PaymentMode, WorkField } from 'app/shared/models/Partner';
import { Civility, Privilege } from 'app/shared/models/contact';
import { CrudPartnerService } from '../crudPartner.service';
import { Subscription, catchError, of } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Employee } from 'app/shared/models/Employee';
import { AddAddressService } from '../../add-address/add-address.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ValidatorService } from 'angular-iban';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
}
@Component({
  selector: 'app-partner-stepper',
  templateUrl: './partner-stepper.component.html',
  styleUrls: ['./partner-stepper.component.scss'],
  providers: [
    // Provide custom date format
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class PartnerStepperComponent implements OnInit {

  currentStepIndex = 0
  formData = {}
  console = console;
  partnerForm: FormGroup;
  partnerAddressForm: FormGroup;
  coordonneesForm: FormGroup;
  contactForm: FormGroup;
  financialInfoForm:FormGroup;
  complInfoForm:FormGroup;
  bankAccountForm: FormGroup
  ibanReactive: FormControl

  step1:FormGroup;
  step2:FormGroup;
  step3:FormGroup;
  step4:FormGroup;
  step5:FormGroup;
  step6:FormGroup;
  lastEmployee: Employee;
  selectedEmployee= {firstName :'', id:null};
  selectedPartner= {id:null, name:'', ref:'', currency:''};
  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  isPageReloaded = false;
  public dataSource: any;
  public displayedColumns: any;
  public getItemSub: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  formWidth = 200; //declare and initialize formWidth property
  formHeight = 700; //declare and initialize formHeight property

  certificationId:number;
  languageId:number;
  skillsId:number;
  addressId:number;
  bankAccountId:number;
  contactId: number;

  i: number;
  j: number;
  k: number;

  companyStatus = Object.values(CompanyStatus).filter(status => status !== CompanyStatus.ARCHIVED);
  legalStatus = Object.values(LegalStatus)
  paymentMode = Object.values(PaymentMode)
  paymentCondition = Object.values(PaymentCondition)
  civilities = Object.values(Civility)
  privileges = Object.values(Privilege)
  controlTypes = Object.values(ControlType)
  // Get the sorted currency values
  sortedCurrencies = Object.values(Currency).sort();

  constructor(
    private _formBuilder: FormBuilder,
    private partnerService: CrudPartnerService,
    private addressService: AddAddressService,
    private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.partnerForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        this.capitalLetterValidator
      ]),
      companyStatus: new UntypedFormControl('', [Validators.required]),
      legalStatus: new UntypedFormControl('', [Validators.required]),
      externalReference : new UntypedFormControl('', [Validators.required]),
      legalIdentifier: new UntypedFormControl('', [
        Validators.required,
        Validators.maxLength(30)
      ]),
      tvaIdentifier: new UntypedFormControl('',[
        Validators.required,
        Validators.maxLength(30)
      ] ),
      nafCode: new UntypedFormControl('',[Validators.maxLength(30)] ),
      logo: new UntypedFormControl('',[Validators.required] ),
      ref: new UntypedFormControl('',[Validators.required, 
        Validators.pattern(/^[a-zA-Z0-9]{10}$/)] ),
      partnershipDate: new UntypedFormControl('',[Validators.required])
    })
    
    this.initializeAddressForm()
    this.initializeAccountForm()
    this.initializeContactForm()

    /*this.bankAccountForm = this.fb.group({
      value : new FormArray([])
     });
     (this.bankAccountForm.get('value') as FormArray).push(this.fb.group({
      bankName :new UntypedFormControl('',[Validators.required]),
      rib: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|[1-8]\d|9[0-7])$/)
      ]),
      bic: new UntypedFormControl('', [Validators.required,
        Validators.pattern(/^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}[0-9]{3}$/)]),
      iban: new UntypedFormControl('', [Validators.required, ValidatorService.validateIban]),
      bankAddress: new UntypedFormControl('', [Validators.required])
    }))*/

    /*this.contactForm = this.fb.group({
      value : new FormArray([])
     });
     (this.contactForm.get('value') as FormArray).push(this.fb.group({
      civility :new UntypedFormControl('',[Validators.required]),
      firstName: new UntypedFormControl('', [
        Validators.required,
        this.capitalLetterValidator
      ]),
      lastName: new UntypedFormControl('', [
        Validators.required,
        this.capitalLetterValidator
      ]),
      privilege: new UntypedFormControl('', [Validators.required]),
      privilegedContact: new UntypedFormControl(false),
      appointmentMaking: new UntypedFormControl(false),
      service: new UntypedFormControl('', [Validators.required]),
      function: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]),
      mobilePhoneNumber: new UntypedFormControl('', [Validators.required]),
      phoneNumber: new UntypedFormControl('', []),
      comment: new UntypedFormControl('', []),
    }))*/

    this.coordonneesForm = this.fb.group({
      phoneNumber: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(/^[\d\s\-+]*$/)
      ]),
      mobilePhoneNumber: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(/^[\d\s\-+]*$/)
      ]),
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]),
      webSite: new UntypedFormControl('', [
        Validators.required
      ]),
    });

    this.financialInfoForm = this.fb.group({
      currency: new UntypedFormControl('', [Validators.required]),
      paymentMode: new UntypedFormControl('', [Validators.required]),
      paymentCondition : new UntypedFormControl('', [Validators.required])
    });

    this.complInfoForm = this.fb.group({
      partnerShipDate: new UntypedFormControl('', [Validators.required]),
      activityStartDate: new UntypedFormControl('', [Validators.required]),
      activityEndDate: new UntypedFormControl('', [Validators.required]),
      foundedSince: new UntypedFormControl('', [Validators.required]),
      inProgressAuthorized: new UntypedFormControl('', [Validators.required]),
      classification: new UntypedFormControl('', [Validators.required]),
      controlType: new UntypedFormControl('', [Validators.required]),
      insurancePolicy: new UntypedFormControl('', [Validators.required]),
      insuranceCompany: new UntypedFormControl('', [Validators.required]),
      
      capital: new UntypedFormControl('', [Validators.required]),
      comment: new UntypedFormControl('', [Validators.required]),
      toleranceRate: new UntypedFormControl('', [
        Validators.required,
        Validators.max(5)
      ])
    });
  }

  initializeAddressForm(): void {
    this.partnerAddressForm = this.fb.group({
      value: this.fb.array([]),
    });
  
    const initialFormGroup = this.fb.group({
      type: new UntypedFormControl('', [Validators.required]),
      num: new UntypedFormControl('', [Validators.required]),
      street: new UntypedFormControl('', [Validators.required]),
      postalCode: new UntypedFormControl('', [Validators.required]),
      city: new UntypedFormControl('', [Validators.required]),
      region: new UntypedFormControl('', [Validators.required]),
      country: new UntypedFormControl('', [Validators.required]),
      isSubmitted: new FormControl(false), // Add the isSubmitted property to the initial FormGroup
    });
  
    (this.partnerAddressForm.get('value') as FormArray).push(initialFormGroup);
  }
  
  initializeAccountForm(): void {
    this.bankAccountForm = this.fb.group({
      value: this.fb.array([]),
    });

    const initialFormGroup = this.fb.group({
      bankName :new UntypedFormControl('',[Validators.required]),
      rib: new UntypedFormControl('', [
        Validators.required,
        //Validators.pattern(/^(0[1-9]|[1-8]\d|9[0-7])$/)
      ]),
      bic: new UntypedFormControl('', [Validators.required,
        Validators.pattern(/^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}[0-9]{3}$/)]),
      iban: new UntypedFormControl('', [Validators.required, ValidatorService.validateIban]),
      bankAddress: new UntypedFormControl('', [Validators.required]),
      isSubmitted: new FormControl(false), // Add the isSubmitted property to the initial FormGroup
    });
    (this.bankAccountForm.get('value') as FormArray).push(initialFormGroup);
  }

  initializeContactForm(): void {
    this.contactForm = this.fb.group({
      value: this.fb.array([]),
    })

    const initialFormGroup = this.fb.group({
      civility :new UntypedFormControl('',[Validators.required]),
      firstName: new UntypedFormControl('', [
        Validators.required,
        this.capitalLetterValidator
      ]),
      lastName: new UntypedFormControl('', [
        Validators.required,
        this.capitalLetterValidator
      ]),
      privilege: new UntypedFormControl('', [Validators.required]),
      privilegedContact: new UntypedFormControl(false),
      appointmentMaking: new UntypedFormControl(false),
      service: new UntypedFormControl('', [Validators.required]),
      function: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]),
      mobilePhoneNumber: new UntypedFormControl('', [Validators.required]),
      phoneNumber: new UntypedFormControl('', []),
      comment: new UntypedFormControl('', []),
      isSubmitted: new FormControl(false), // Add the isSubmitted property to the initial FormGroup
    });
    (this.contactForm.get('value') as FormArray).push(initialFormGroup);
  }

  /////Make first letter capital//////
  capitalLetterValidator(control: FormControl): { [key: string]: boolean } | null {
    const firstLetter = control.value.charAt(0);
    if (firstLetter && firstLetter !== firstLetter.toUpperCase()) {
      return { 'capitalLetter': true };
    }
    return null;
  }

  onStepChange(index: number): void {
    if (index >= this.currentStepIndex) {
      // Allow navigation to the next step
      this.currentStepIndex = index;
    } else {
      // Block navigation to previous steps
      // You can show an error message or handle it as desired
    }
  }

  onFileSelected(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        console.log(reader.result)
        this.partnerForm.patchValue({
          logo: reader.result
        });
  
        console.log(this.partnerForm.value)
      };
    }
  }

  savePartner(): void {
    console.log('Submitting form...');
  //  if (this.myForm.valid) {
      console.log('Form is valid, submitting...');
      this.partnerService.addItem(this.partnerForm.value).subscribe({
        next: (res) => {
          console.log('Item added successfully', res);
          this.selectedPartner = res;
          console.log('Selected partner ID:', this.selectedPartner.id);
          console.log('Form value', this.partnerForm.value);
          this.submitted = true;
         // this.openPopUp();
        },
        error: (e) => console.error('Error adding item', e)
      });
      //this.dialog.open(cvDialog1Component);
    }

  savePartnerCoordonnees(): void {
    console.log('Submitting form...');
  //  if (this.myForm.valid) {
      console.log('Form is valid, submitting...');
      console.log('Selected partner ID:', this.selectedPartner.id);
      console.log('Form value', this.coordonneesForm.value);
      this.partnerService.addPartnerCoordonnees({...this.coordonneesForm.value , id:this.selectedPartner.id}).subscribe({
        next: (res) => {
          console.log('Item added successfully', res);
          this.selectedPartner = res;
          console.log('Selected partner ID:', this.selectedPartner.id);
          console.log('Form value', this.coordonneesForm.value);
          this.submitted = true;
         // this.openPopUp();
        },
        error: (e) => console.error('Error adding item', e)
      });
    }

    saveFinancial(): void {
      console.log('Submitting form...');
    //  if (this.myForm.valid) {
        console.log('Form is valid, submitting...');
        console.log('Selected partner ID:', this.selectedPartner.id);
        console.log('Form value', this.financialInfoForm.value);
        this.partnerService.addPartnerFinancial({...this.financialInfoForm.value , id:this.selectedPartner.id}).subscribe({
          next: (res) => {
            console.log('Item added successfully', res);
            this.selectedPartner = res;
            console.log('Selected partner ID:', this.selectedPartner.id);
            console.log('Form value', this.financialInfoForm.value);
            this.submitted = true;
           // this.openPopUp();
          },
          error: (e) => console.error('Error adding item', e)
        });
      }

  savePartnerCompleted(): void {
    console.log('Submitting form...');
    //  if (this.myForm.valid) {
    console.log('Form is valid, submitting...');
    console.log('Selected partner ID:', this.selectedPartner.id);
    console.log('Form value', this.complInfoForm.value);
    this.partnerService.finishPartnerInfos({...this.complInfoForm.value , id:this.selectedPartner.id}).subscribe({
      next: (res) => {
        console.log('Item added successfully', res);
        this.selectedPartner = res;
        console.log('Selected partner ID:', this.selectedPartner.id);
        console.log('Form value', this.complInfoForm.value);
        this.submitted = true;
        // this.openPopUp();
        },
          error: (e) => console.error('Error adding item', e)
      });
    }

  // Save previous address and open a new address form
  saveAddAddress(i: number): void {
    const addressArray = this.partnerAddressForm.get('value') as FormArray;
    const addressFormGroup = addressArray.at(i) as FormGroup;
  
    addressFormGroup.get('isSubmitted')?.setValue(true);

    this.addressService.addAddress({...addressFormGroup.value, partnerNum: this.selectedPartner.id}).subscribe({
      next: (res) => {
       console.log('Item added successfully', res);
       console.log('Form value', this.partnerAddressForm.value.value[i]);
        this.submitted = true;
        this.addressId=res.id
      },
      error: (e) => {
        console.error('Error adding item', e);
        console.log('partner details is invalid');
        console.log(this.partnerAddressForm.errors);
      }
    })
  
    // Add a new form group to the FormArray and reset the fields
    const newFormGroup = this.fb.group({
      type: new UntypedFormControl('', [Validators.required]),
      num: new UntypedFormControl('', [Validators.required]),
      street: new UntypedFormControl('', [Validators.required]),
      postalCode: new UntypedFormControl('', [Validators.required]),
      city: new UntypedFormControl('', [Validators.required]),
      region: new UntypedFormControl('', [Validators.required]),
      country: new UntypedFormControl('', [Validators.required]),
      isSubmitted: new FormControl(false), // Add the isSubmitted property to the new FormGroup
    });
  
    addressArray.push(newFormGroup);
  }
  
  
  
  
  

  // Enregistrer dernière adresse du partenaire
  saveAddress(i: number): void {
    const addressArray = this.partnerAddressForm.get('value') as FormArray;
    const addressFormGroup = addressArray.at(i) as FormGroup;
  
    addressFormGroup.get('isSubmitted')?.setValue(true);
  
    this.addressService.addAddress({...addressFormGroup.value, partnerNum: this.selectedPartner.id}).subscribe({
     next: (res) => {
      console.log('Item added successfully', res);
      console.log('Form value', this.partnerAddressForm.value.value[i]);
       this.submitted = true;
       this.addressId=res.id
     },
     error: (e) => {
       console.error('Error adding item', e);
       console.log('partner details is invalid');
       console.log(this.partnerAddressForm.errors);
     }
   })
  }

  // Save previous bank account and open a new bank account form
  saveAddBankAccount(i: number): void {
    const accountArray = this.bankAccountForm.get('value') as FormArray;
    const accountFormGroup = accountArray.at(i) as FormGroup;
  
    accountFormGroup.get('isSubmitted')?.setValue(true);

    this.partnerService.addBankAccount({...accountFormGroup.value, partnerNum:this.selectedPartner.id}).subscribe({
     next: (res) => {
      console.log('Item added successfully', res);
      console.log('Form value', this.bankAccountForm.value.value[i]);
       this.submitted = true;
       this.bankAccountId=res.id
     },
     error: (e) => {
       console.error('Error adding item', e);
       console.log('partner details is invalid');
       console.log(this.bankAccountForm.errors);
     }
   })

   // Add a new form group to the FormArray and reset the fields
   const newFormGroup = this.fb.group({
    bankName :new UntypedFormControl('',[Validators.required]),
      rib: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(/^(0[1-9]|[1-8]\d|9[0-7])$/)
      ]),
      bic: new UntypedFormControl('', [Validators.required,
        Validators.pattern(/^[A-Z]{4}[-]{0,1}[A-Z]{2}[-]{0,1}[A-Z0-9]{2}[-]{0,1}[0-9]{3}$/)]),
      iban: new UntypedFormControl('', [Validators.required, ValidatorService.validateIban]),
      bankAddress: new UntypedFormControl('', [Validators.required]),
    isSubmitted: new FormControl(false), // Add the isSubmitted property to the new FormGroup
  });

    accountArray.push(newFormGroup);
  }

  // Enregistrer dernier compte bancaire au partenaire 
  saveBankAccount(i:any): void {
    const accountArray = this.bankAccountForm.get('value') as FormArray;
    const accountFormGroup = accountArray.at(i) as FormGroup;
  
    accountFormGroup.get('isSubmitted')?.setValue(true);
     
    this.partnerService.addBankAccount({...accountFormGroup.value, partnerNum:this.selectedPartner.id}).subscribe({
     next: (res) => {
      console.log('Item added successfully', res);
      console.log('Form value', this.bankAccountForm.value.value[i]);
       this.submitted = true;
       this.bankAccountId=res.id
     },
     error: (e) => {
       console.error('Error adding item', e);
       console.log('partner details is invalid');
       console.log(this.bankAccountForm.errors);
     }
   })
  }

  // Save previous contact and open a new contact form
  saveAddContact(i:any): void {
    const contactArray = this.contactForm.get('value') as FormArray;
    const contactFormGroup = contactArray.at(i) as FormGroup;
  
    contactFormGroup.get('isSubmitted')?.setValue(true);
    this.partnerService.addContact({...this.contactForm.value, partnerNum:this.selectedPartner.id}).subscribe({
     next: (res) => {
      console.log('Item added successfully', res);
      console.log('Form value', this.contactForm.value.value[i]);
       this.submitted = true;
       this.contactId=res.id
     },
     error: (e) => {
       console.error('Error adding item', e);
       console.log('partner details is invalid');
       console.log(this.partnerAddressForm.errors);
     }
   })
   // Add a new form group to the FormArray and reset the fields
   const newFormGroup = this.fb.group({
    civility :new UntypedFormControl('',[Validators.required]),
      firstName: new UntypedFormControl('', [
        Validators.required,
        this.capitalLetterValidator
      ]),
      lastName: new UntypedFormControl('', [
        Validators.required,
        this.capitalLetterValidator
      ]),
      privilege: new UntypedFormControl('', [Validators.required]),
      privilegedContact: new UntypedFormControl(false),
      appointmentMaking: new UntypedFormControl(false),
      service: new UntypedFormControl('', [Validators.required]),
      function: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50)
      ]),
      mobilePhoneNumber: new UntypedFormControl('', [Validators.required]),
      phoneNumber: new UntypedFormControl('', []),
      comment: new UntypedFormControl('', []),
    isSubmitted: new FormControl(false), // Add the isSubmitted property to the new FormGroup
  });

  contactArray.push(newFormGroup);
  }


  // Enregistrer dernier contact au partenaire
  saveContact(i:any): void {
    const contactArray = this.contactForm.get('value') as FormArray;
    const contactFormGroup = contactArray.at(i) as FormGroup;
  
    contactFormGroup.get('isSubmitted')?.setValue(true);
     
    this.partnerService.addContact({...contactFormGroup.value, partnerNum:this.selectedPartner.id}).subscribe({
     next: (res) => {
      console.log('Item added successfully', res);
      console.log('Form value', this.contactForm.value.value[i]);
       this.submitted = true;
       this.contactId=res.id
     },
     error: (e) => {
       console.error('Error adding item', e);
       console.log('partner details is invalid');
       console.log(this.partnerAddressForm.errors);
     }
   })
  }

  
  isAnyContactPrivileged(i): void {
    const formArray = this.contactForm.get('value') as FormArray;
    const item = formArray.at(i) as FormGroup;
    const privilegedContact = item.get('privilegedContact');
  
    if (privilegedContact.value == true) {
      for (let j = i + 1; j < formArray.length; j++) {
      const item = formArray.at(j) as FormGroup;
      item.get('privilegedContact').disable();
      }
    }
  }
  

  currencyMap: {[key: string]: string} = {
    'AFN': 'AFN - Afghani afghan',
    'AMD': 'AMD - Dram arménien',
    'AUD': 'AUD - Dollar australien',
    'BSD': 'BSD - Dollar bahaméen',
    'BBD': 'BBD - Dollar barbadien',
    'BZD': 'BZD - Dollar bélizien',
    'BMD': 'BMD - Dollar bermudien',
    'BND': 'BND - Dollar brunéien',
    'BIF': 'BIF - Franc burundais',
    'KHR': 'KHR - Riel cambodgien',
    'CAD': 'CAD - Dollar canadien',
    'CVE': 'CVE - Escudo cap-verdien',
    'KYD': 'KYD - Dollar des îles Caïmans',
    'XAF': 'XAF - Franc CFA (BEAC)',
    'XPF': 'XPF - Franc CFP',
    'CLP': 'CLP - Peso chilien',
    'CNY': 'CNY - Yuan renminbi chinois',
    'COP': 'COP - Peso colombien',
    'KMF': 'KMF - Franc comorien',
    'CRC': 'CRC - Colón costaricain',
    'HRK': 'HRK - Kuna croate',
    'CZK': 'CZK - Couronne tchèque',
    'DKK': 'DKK - Couronne danoise',
    'DJF': 'DJF - Franc djiboutien',
    'DOP': 'DOP - Peso dominicain',
    'EGP': 'EGP - Livre égyptienne',
    'ETB': 'ETB - Birr éthiopien',
    'EUR': 'EUR - Euro',
    'FKP': 'FKP - Livre des îles Falkland',
    'FJD': 'FJD - Dollar fidjien',
    'GMD': 'GMD - Dalasi gambien',
    'GEL': 'GEL - Lari géorgien',
    'GHS': 'GHS - Cedi ghanéen',
    'GIP': 'GIP - Livre de Gibraltar',
    'GTQ': 'GTQ - Quetzal guatémaltèque',
    'GNF': 'GNF - Franc guinéen',
    'GYD': 'GYD - Dollar guyanien',
    'HTG': 'HTG - Gourde haïtienne',
    'HNL': 'HNL - Lempira hondurien',
    'HKD': 'HKD - Dollar de Hong Kong',
    'HUF': 'HUF - Forint hongrois',
    'ISK': 'ISK - Couronne islandaise',
    'INR': 'INR - Roupie indienne',
    'IDR': 'IDR - Roupie indonésienne',
    'IRR': 'IRR - Rial iranien',
    'IQD': 'IQD - Dinar iraquien',
    'ILS': 'ILS - Shekel israélien',
    'JPY': 'JPY - Yen japonais',
    'JOD': 'JOD - Dinar jordanien',
    'KZT': 'KZT - Tenge kazakh',
    'KES': 'KES - Shilling kényan',
    'KWD': 'KWD - Dinar koweïtien',
    'LAK': 'LAK - Kip laotien',
    'LBP': 'LBP - Livre libanaise',
    'LRD': 'LRD - Dollar libérien',
    'MGA': 'MGA - Ariary malgache',
    'MWK': 'MWK - Kwacha malawite',
    'MYR': 'MYR - Ringgit malaisien',
    'MUR': 'MUR - Roupie mauricienne',
    'MXN': 'MXN - Peso mexicain',
    'MDL': 'MDL - Leu moldave',
    'MNT': 'MNT - Tugrik mongol',
    'MAD': 'MAD - Dirham marocain',
    'MZN': 'MZN - Metical mozambicain',
    'MMK': 'MMK - Kyat birman',
    'NAD': 'NAD - Dollar namibien',
    'NPR': 'NPR - Roupie népalaise',
    'ANG': 'ANG - Florin antillais',
    'NZD': 'NZD - Dollar néo-zélandais',
    'NIO': 'NIO - Córdoba oro nicaraguayen',
    'NGN': 'NGN - Naira nigérian',
    'NOK': 'NOK - Couronne norvégienne',
    'OMR': 'OMR - Rial omanais',
    'PKR': 'PKR - Roupie pakistanaise',
    'PAB': 'PAB - Balboa panaméen',
    'PGK': 'PGK - Kina papou-néo-guinéen',
    'PYG': 'PYG - Guarani paraguayen',
    'PEN': 'PEN - Sol péruvien',
    'PHP': 'PHP - Peso philippin',
    'PLN': 'PLN - Zloty polonais',
    'QAR': 'QAR - Riyal qatari',
    'RON': 'RON - Leu roumain',
    'RUB': 'RUB - Rouble russe',
    'RWF': 'RWF - Franc rwandais',
    'SHP': 'SHP - Livre de Sainte-Hélène',
    'SVC': 'SVC - Colón salvadorien',
    'SAR': 'SAR - Riyal saoudien',
    'RSD': 'RSD - Dinar serbe',
    'SCR': 'SCR - Roupie seychelloise',
    'SLL': 'SLL - Leone sierra-léonais',
    'SGD': 'SGD - Dollar de Singapour',
    'SOS': 'SOS - Shilling somalien',
    'ZAR': 'ZAR - Rand sud-africain',
    'KRW': 'KRW - Won sud-coréen',
    'SSP': 'SSP - Livre sud-soudanaise',
    'LKR': 'LKR - Roupie srilankaise',
    'SDG': 'SDG - Livre soudanaise',
    'SRD': 'SRD - Dollar surinamais',
    'SZL': 'SZL - Lilangeni swazi',
    'SEK': 'SEK - Couronne suédoise',
    'CHF': 'CHF - Franc suisse',
    'SYP': 'SYP - Livre syrienne',
    'TWD': 'TWD - Dollar taïwanais',
    'TZS': 'TZS - Shilling tanzanien',
    'THB': 'THB - Baht thaïlandais',
    'TOP': 'TOP - Paʻanga tongan',
    'TTD': 'TTD - Dollar de Trinité-et-Tobago',
    'TND': 'TND - Dinar tunisien',
    'TRY': 'TRY - Livre turque',
    'TMT': 'TMT - Manat turkmène',
    'AED': 'AED - Dirham des Émirats arabes unis',
    'UGX': 'UGX - Shilling ougandais',
    'UAH': 'UAH - Hryvnia ukrainienne',
    'UYU': 'UYU - Peso uruguayen',
    'UZS': 'UZS - Sum ouzbek',
    'VUV': 'VUV - Vatu vanuatuan',
    'VEF': 'VEF - Bolivar vénézuélien',
    'VND': 'VND - Dong vietnamien',
    'XOF': 'XOF - Franc CFA (BCEAO)',
    'YER': 'YER - Rial yéménite',
    'ZMW': 'ZMW - Kwacha zambien',
    'ZWL': 'ZWL - Dollar zimbabwéen',
  }

   get getAddress() {
    return (this.partnerAddressForm.get('value') as FormArray).controls;
  }

  get getBankAccount() {
    return (this.bankAccountForm.get('value') as FormArray).controls;
  }

  get getContact() {
    return (this.contactForm.get('value') as FormArray).controls;
  }

  get activityStartDate() {
    const value = this.complInfoForm.get('activityStartDate').value;
    return this.datePipe.transform(value, 'yy/MM/dd');
  }
  
  get activityEndDate() {
    const value = this.complInfoForm.get('activityEndDate').value;
    return this.datePipe.transform(value, 'yy/MM/dd');
  }
  
  get foundedSince() {
    const value = this.complInfoForm.get('foundedSince').value;
    return this.datePipe.transform(value, 'yy/MM/dd');
  }

  companyStatusMap = {
    [CompanyStatus.PROSPECT]:'Prospect',
    [CompanyStatus.SUPPLIER]:'Fournisseur',
    [CompanyStatus.CLIENT]:'Client'
  };

  workFieldMap = {
    [WorkField.IT]:'IT',
    [WorkField.INDUSTRY]:'Industrie',
    [WorkField.SALES]:'Ventes',
    [WorkField.AGRICULTURE] :'Agriculture',
    [WorkField.BANKING] :'Banking',
    [WorkField.E_COM] :'E-Commerce',
    [WorkField.ASSURANCE] :'Assurance',
    [WorkField.FINANCE] :'Finance'
  }

  legalStatusMap = {
    [LegalStatus.SA]:'SA',
    [LegalStatus.SARL]:'SARL'
  }

  paymentConditionMap = {
    [PaymentCondition.IMMEDIATE]:'Paiement immédiat',
    [PaymentCondition.ADVANCED]:"Paiement à l'avance",
    [PaymentCondition.ORDER]:'Paiement à la commande',
    [PaymentCondition.ON_DELIVERY] :'Paiement à la livraison',
    [PaymentCondition._30_DAYS] :'Paiement à 30 jours nets',
    [PaymentCondition._60_DAYS] :'Paiement à 60 jours nets ',
    [PaymentCondition._90_DAYS] :'Paiement à 90 jours nets',
    [PaymentCondition.IN_TERM] :'Paiement à terme',
    [PaymentCondition.ADVANCE] :'Paiement anticipé',
    [PaymentCondition.AT_REQUEST] :'Paiement à la réception'
  }

  paymentModeMap = {
    [PaymentMode.CASH]:'Cash',
    [PaymentMode.CREDIT]:'Crédit',
    [PaymentMode.DEBIT_CARD]:'Carte de débit',
    [PaymentMode.BANK_TRANSFER] :'Virement bancaire',
    [PaymentMode.PAYPAL] :'Paypal',
    [PaymentMode.CHECK] :'Chèque'
  }

  civilityMap = {
    [Civility.MR]:'Mr',
    [Civility.MRS]:'Mme',
    [Civility.MS] : 'Mlle'  
  }

  privilegeMap = {
    [Privilege.HIGH]:'Elevé',
    [Privilege.MEDIUM]:'Moyen',
    [Privilege.LOW] : 'Faible'
  }

  controlTypeMap = {
    [ControlType.OFFER_CONTROL]:'Contrôle devis',
    [ControlType.ORDER_CONTROL]:'Contrôle commande'
  }
}