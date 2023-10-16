import { CrudPartnerService } from './../../crudPartner.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  Validators,  FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Partner,CompanyStatus,WorkField,LegalStatus,Provenance ,Country, Currency, PaymentCondition, PaymentMode, ControlType, BlockingReason} from 'app/shared/models/Partner';
import { Civility, Privilege } from 'app/shared/models/contact';
import { Availability, RequirementStatus, RequirementType } from 'app/shared/models/req';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './ngx-table-popup.component.html'
})
export class NgxTablePopupComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  sortedCurrencies = Object.values(Currency).sort()
  paymentModes = Object.values(PaymentMode)
  paymentConditions = Object.values(PaymentCondition)
  controlTypes = Object.values(ControlType)
  privileges = Object.values(Privilege)
  reasons = Object.values(BlockingReason)

  selectedCurrency: string;


  public itemForm: FormGroup;
  CompanyStatus = Object.values(CompanyStatus);
  WorkField :string []= Object.values(WorkField);
  LegalStatus = Object.values(LegalStatus);
  Provenance = Object.values(Provenance);
  countries: Country[];
  states: string[];
  selectedFile: File;
  Privilege :string []= Object.values(Privilege);
  Civility :string []= Object.values(Civility);
  formWidth = 200; //declare and initialize formWidth property
  formHeight = 700; //declare and initialize formHeight property
  Availability : string [] = Object.values(Availability);
  repeatForm : FormGroup;
  
  RequirementStatus  :string []= Object.values(RequirementStatus);
  RequirementType : string[] = Object.values(RequirementType);

  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NgxTablePopupComponent>,
    private fb: FormBuilder,
    private crudService: CrudPartnerService,  
    private http: HttpClient
  ) {     this.countries = this.crudService.getCountries();

  }



  buildItemForm(item){
    //this.notProspectPartner()
    const companyStatus = Object.values(CompanyStatus).filter(status => {
      return !(item.companyStatus 
        && item.companyStatus !== CompanyStatus.PROSPECT 
        && (status === CompanyStatus.PROSPECT || status === CompanyStatus.CLIENT_SUPPLIER)
        );
    });
    this.itemForm = this.fb.group({
      name : [item.name || '', Validators.required],
      ref : [item.ref || '', Validators.required], 
      externalReference : [item.externalReference || '', Validators.required], 
      legalIdentifier : [item.legalIdentifier || '', Validators.required],
      tvaIdentifier : [item.tvaIdentifier || '', Validators.required],
      nafCode : [item.nafCode || '', Validators.required],
      phoneNumber : [item.phoneNumber || '', Validators.required ,],
      mobilePhoneNumber: [item.mobilePhoneNumber ||'', Validators.required, ],
      email: [item.email || '', Validators.required],
      webSite: [item.webSite ||'', Validators.required, ],
      currency : [item.currency || '', Validators.required],
      paymentCondition : [item.paymentCondition || '', Validators.required],
      paymentMode : [item.paymentMode || '', Validators.required],
      logo : [item.logo || null, Validators.required],
      partnerShipDate : [item.partnerShipDate || '', Validators.required],
      activityStartDate : [item.activityStartDate || '', Validators.required],
      activityEndDate : [item.activityEndDate || '', Validators.required],
      foundedSince : [item.foundedSince || '', Validators.required],
      companyStatus : [item.companyStatus || '', Validators.required],
      legalStatus : [item.legalStatus || '', Validators.required],
      capital : [item.capital || '', Validators.required],
      insuranceCompany : [item.insuranceCompany || '', Validators.required],
      insurancePolicy : [item.insurancePolicy || '', Validators.required],
      inProgressAuthorized : [item.inProgressAuthorized || '', Validators.required],
      toleranceRate : [item.inProgressAuthorized || '', Validators.required],
      controlType : [item.controlType || '', Validators.required],
      comment : [item.comment || '', Validators.required],
      classification : [item.classification || '', Validators.required],
      blocked: [item.blocked || false],
      reason: [item.reason || '', Validators.required],
      blockingReason : [item.blockingReason || '']
      //ceoName : [item.ceoName || '', Validators.required],
      //postCode : [item.postCode || '', Validators.required],
      //city : [item.city || '', Validators.required],
      //description : [item.description || '', Validators.required],
      //partnerShipDate : [item.partnerShipDate || '', Validators.required],
      //refPhoneNumber : [item.refPhoneNumber || '', Validators.required ,],
      //country : [item.country || '', Validators.required],
      //workField : [item.workField || '', Validators.required],
      //provenance : [item.provenance || '', Validators.required],
    });
    this.CompanyStatus = companyStatus;
  }

  
 
  ngOnInit() {
    console.log(this.data.payload.activityStartDate)
    console.log(this.data.payload.activityEndDate)
    console.log(this.data.payload.partnerShipDate)
    this.buildItemForm(this.data.payload)
    // Update selectedCurrency when currency selection changes
    // Initialize selectedCurrency with the default currency value
    const defaultCurrency = this.itemForm.get('currency').value;
    this.selectedCurrency = defaultCurrency;

    // Update selectedCurrency when currency selection changes
    this.itemForm.get('currency').valueChanges.subscribe((value) => {
    this.selectedCurrency = value;
  });
    
  }

  submit() {
    
    this.dialogRef.close(this.itemForm.value)


  }

  notProspectPartner(){
    if(this.data.payload.companyStatus && this.data.payload.companyStatus != CompanyStatus.PROSPECT){
      this.CompanyStatus.filter(status => status !== CompanyStatus.PROSPECT);
    }
  }

  onCountryChange(countryShotName: string) {
    this.states = this.crudService.getStatesByCountry(countryShotName);
  }


  createRepeatForm(): FormGroup {
    return this._formBuilder.group({
    });
  }
  get repeatFormGroup() {
    return this.repeatForm.get('repeatArray') as FormArray;
  }
  handleAddRepeatForm() {
    this.repeatFormGroup.push(this.createRepeatForm());
  }
  handleRemoveRepeatForm(index: number) {
    this.repeatFormGroup.removeAt(index);
    if (index > 0) { // check if the index is greater than 0
      const repeatArray = this.repeatForm.get('repeatArray') as FormArray;
      repeatArray.removeAt(index);
  }
  }
  
  onFileSelected(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        console.log(reader.result)
        this.itemForm.patchValue({
          logo: reader.result
        });
  
        console.log(this.itemForm.value)
      };
    }
  }

  /*toggleOtherReasonField() {
    const blocked = this.itemForm.get('blocked');
    const reason = this.itemForm.get('reason');

    if (blocked.value) {
      reason.clearValidators();
    } else {
      reason.setValidators(Validators.required);
    }

    reason.updateValueAndValidity();
  }*/

  isOtherReasonFieldVisible(){
    const blockingReason = this.itemForm.get('blockingReason').value
    return this.itemForm.get('blocked').value && blockingReason == BlockingReason.OTHER
  }

  isBlockingReasonFieldVisible() {
    return this.itemForm.get('blocked').value;
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
  };

  CompanyStatusMap = {
    [CompanyStatus.PROSPECT]:'Prospect',
    [CompanyStatus.CLIENT_SUPPLIER]:'Client / Fournisseur',
    [CompanyStatus.SUPPLIER]:'Fournisseur',
    [CompanyStatus.CLIENT]:'Client',
    [CompanyStatus.ARCHIVED] :'Archivé',
  };

  provenanceMap = {
    [Provenance.JOBS_FORUM]:'Salon des entreprises',
    [Provenance.RECOMMENDATION]:'Recommendation',
   [Provenance.COOPERATION]:'Coopération',
   [Provenance.OTHER] :'Autre'
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

  privilegeMap = {
    [Privilege.HIGH]:'Elevé',
    [Privilege.MEDIUM]:'Moyen',
    [Privilege.LOW] : 'Faible'
  }

  controlTypeMap = {
    [ControlType.OFFER_CONTROL]:'Contrôle devis',
    [ControlType.ORDER_CONTROL]:'Contrôle commande'
  }

  blockingReasonMap = {
    [BlockingReason.NON_PAYMENT]:'Défaut de paiement',
    [BlockingReason.DISPUTE]:'Litige',
    [BlockingReason.DEFINITIVE_CLOSURE]:'Fermeture définitive',
    [BlockingReason.OTHER] :'Autre'
  };
}