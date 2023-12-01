import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReqService } from '../../Requirement/req.service';
import { RequirementStatus, RequirementType, req } from 'app/shared/models/req';
import { BillingType, QuotationStatus } from 'app/shared/models/Quotation';
import { Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Currency, Partner, PaymentCondition, PaymentMode } from 'app/shared/models/Partner';
import { Catalog } from 'app/shared/models/Catalog';
import { ProfileCatalogService } from '../../profile-catalog/profile-catalog.service';
import { Level, Profile } from 'app/shared/models/Profile';
import { QuotationService } from '../quotation.service';
import { CrudPartnerService } from '../../partner/crudPartner.service';

@Component({
  selector: 'app-quotation-pop',
  templateUrl: './quotation-pop.component.html',
  styleUrls: ['./quotation-pop.component.scss']
})
export class QuotationPopComponent implements OnInit {
  private profileSelectionSubscription: Subscription | undefined;
  
  isNew: boolean
  public itemForm: FormGroup
  listReq : req [] =[]
  partner : Partner
  catalog : Catalog
  currencyCatalog : Catalog
  req : req
  profile : Profile
  profileSource : Profile
  
  listCatalog : any[]
  listPartner : Partner [] = [] 
  listProfiles : Profile [] = []
  private profileId : number
  private reqId : number
  private selectedCatalogId : number
  private selectedReqId : number
  private selectedProfileId : number
  billingTypes = Object.values(BillingType)
  paymentConditions = Object.values(PaymentCondition)
  paymentModes = Object.values(PaymentMode)
  quotationStatus = Object.values(QuotationStatus)
  currencies = Object.values(Currency)

  profiles: FormArray;
  public myProfileForm: FormGroup;

  repeatForm: FormGroup;
  repeatFormUpdated: FormGroup;
  public showProfilesForm: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<QuotationPopComponent>,
    private fb: FormBuilder, 
    private _formBuilder: FormBuilder,
    private reqService: ReqService,
    private partnerService : CrudPartnerService,
    private quotationService: QuotationService,
    private catalogService: ProfileCatalogService
  ) { }

  buildItemForm(item){
    const profiles = item.profiles && item.profiles.length > 0 ? item.profiles : [];

    this.itemForm = this.fb.group({
      billingType : [item.billingType || '', Validators.required],
      quotationStatus : [item.quotationStatus || QuotationStatus.IN_PROGRESS, Validators.required],
    //  billingInstruction : [item.billingInstruction || '', Validators.required],
      requirementNum: [{ value: item.partnerNum, disabled: !this.isNew }|| '', Validators.required],
      customerAgreement: [item.customerAgreement, Validators.required],
      catalogNum: [item.catalogId, Validators.required],
      partnerNum: [{ value: item.partnerNum, disabled: true }],
      htRevenue: [{ value: item.htRevenue, disabled: true }],
      revenueOrd: [{ value: item.revenueOrd, disabled: true }],
      tva: [item.tva, Validators.required],
      paymentCondition: [item.paymentCondition, Validators.required],
      currency: [{ value: item.currency, disabled: true }, Validators.required],
      paymentMode: [item.paymentMode, Validators.required],
      otherPaymentMode: [item.otherPaymentMode, Validators.required],
      comment: [item.comment, Validators.required],
      profiles: this.fb.array(profiles.map(updatedProfile => this.buildUpdatedProfileFormGroup(updatedProfile)))
    })
  }

  ngOnInit(): void {
    this.buildItemForm(this.data.payload)
    console.log(this.data.isNew)
    console.log(this.data.payload)
    this.isNew = this.data.isNew 
    this.getReqList()
    this.getCatalogList()
    this.getPartnerList()

    if(!this.data.isNew){
      console.log(this.data.payload.profiles[0].profileId)
      this.getCatalogByProfileId(this.data.payload.profiles[0].profileId)
      this.loadQuotationReq(this.data.payload.requirementId)
      this.loadProfileByUpdatedProfile(this.data.payload.profiles[0].profileId)
      //this.getProfileCandidateDailyCost()
    }

    //////////////////////////////////////updates repeat form
    this.myProfileForm = this._formBuilder.group({
      profiles: this._formBuilder.array([])  // Initialize profiles as an empty FormArray
    });
    this.buildItemForm(this.data.payload);
    this.repeatForm = this._formBuilder.group({
      repeatArray: this._formBuilder.array([this.createRepeatForm()])
    });
    //////////////////////////////////////end updates repeat form
    this.itemForm.get('catalogNum').valueChanges.subscribe((selectedCatalogId: number) => {
      this.selectedCatalogId = selectedCatalogId;
      this.loadProfilesList();
      this.getCatalog()
    });

    this.itemForm.get('requirementNum').valueChanges.subscribe((selectedReqId: number) => {
      this.selectedReqId = selectedReqId;
      this.getPartnerByReqId(selectedReqId)

    });
  }

  buildUpdatedProfileFormGroup(updatedProfile) {
    return this.fb.group({
      id: [updatedProfile.id || ''],
      candidateNumber: [updatedProfile.candidateNumber || ''],
      candidateDailyCost: [updatedProfile.candidateDailyCost || ''], // Add candidateDailyCost value from profile object
      period: [updatedProfile.period || ''],
      startDate: [updatedProfile.startDate || '', Validators.required],
      endDate: [updatedProfile.endDate || ''],
      comment: [updatedProfile.comment || ''],
      profile: [updatedProfile.profileId || '']
    });
  }
  
  
  addProfileFormGroup(index: number): void {
    const profilesFormArray = this.itemForm.get('profiles') as FormArray;
    const newFormGroup = this.fb.group({
      id: [''],
      candidateNumber: [''],
      candidateDailyCost: [null],
      period: [''],
      comment: [''],
      startDate: [''],
      endDate: [''],
      profile: [''],
    });
  
    profilesFormArray.push(newFormGroup);
  
    // Subscribe to value changes of 'profile' field
    this.profileSelectionSubscription?.unsubscribe();
    this.profileSelectionSubscription = newFormGroup.get('profile')?.valueChanges.subscribe((selectedProfileId: any) => {
      console.log('Selected Profile ID:', selectedProfileId);
  
      if (selectedProfileId) {
        const profile = this.listProfiles.find(p => p.id === selectedProfileId.id);
        if (profile) {
          newFormGroup.patchValue({ candidateDailyCost: profile.candidateDailyCost });
        }
      }
    });
  }
  
  
  

  toggleProfilesForm(): void {
    const profilesFormArray = this.itemForm.get('profiles') as FormArray;
    if (profilesFormArray.length === 0) {
      const newFormGroup = this.fb.group({
        id: [''],
        candidateNumber: [''],
        candidateDailyCost: [null],
        period: [''],
        comment: [''],
        startDate: [''],
        endDate: [''],
        profile: [''],
      });
      profilesFormArray.push(newFormGroup)
      
      this.showProfilesForm = true; // Always set showProfilesForm to true
    // Subscribe to value changes of 'profile' field
    this.profileSelectionSubscription?.unsubscribe();
    this.profileSelectionSubscription = newFormGroup.get('profile')?.valueChanges.subscribe((selectedProfileId: any) => {
      console.log('Selected Profile ID:', selectedProfileId);
  
      if (selectedProfileId) {
        const profile = this.listProfiles.find(p => p.id === selectedProfileId.id);
        if (profile) {
          newFormGroup.patchValue({ candidateDailyCost: profile.candidateDailyCost });
        }
      }
    });
    }
    
  }

  toggleUpdateProfilesForm(): void {
    const profilesFormArray = this.itemForm.get('profiles') as FormArray;
    if (profilesFormArray.length === 0) {
      profilesFormArray.push(this.fb.group({
        id: [''],
        candidateNumber: [''],
        candidateDailyCost: [null],
        period: [''],
        comment: [''],
        startDate: [''],
        endDate: [''],
        profile: [''],
      }));
    }
    this.showProfilesForm = true; // Always set showProfilesForm to true
  }

  getReqList(){
    this.reqService.getItems().subscribe((data :any )=>{
      this.listReq = data
      this.reqId = this.data.reqId;
      this.filterReqList()
    })
  }

  getPartnerList(){
    this.partnerService.getItems().subscribe((data :any )=>{
      this.listPartner = data
      this.reqId = this.data.reqId;
      console.log(data)
    })
    console.log(this.listPartner)
  }

  filterReqList(){
    this.listReq = this.listReq.filter((item: req) => {
      return (
        item.requirementStatus === RequirementStatus.IN_PROGRESS ||
        item.requirementStatus === RequirementStatus.OPEN ||
        item.requirementStatus === RequirementStatus.PARTIALLY_WON ||
        item.requirementStatus === RequirementStatus.PARTIALLY_LOST ||
        item.requirementStatus === RequirementStatus.TOTALLY_LOST ||
        item.requirementStatus === RequirementStatus.TOTALLY_WON 
      );
    });
  }

  loadProfilesList() {
    if (this.selectedCatalogId) {
      this.catalogService.getItemProfiles(this.selectedCatalogId).subscribe(
        (profiles: Profile[]) => {
          this.listProfiles = profiles;
          console.log(this.listProfiles)
        },
        (error) => {
          console.error('Error fetching profiles:', error);
        }
      );
    } else {
      this.listProfiles = []; // Clear the profiles list if no catalog is selected
    }
  }

  getCatalog(){
    if(this.selectedCatalogId){
      this.catalogService.getItem(this.selectedCatalogId).subscribe((data: any) => {
        this.currencyCatalog = data 
        console.log(this.currencyCatalog)
        this.itemForm.get('currency').patchValue(this.currencyCatalog.currency);
      })
    }
  }

  getCatalogList(){
    this.catalogService.getItems().subscribe((data :any )=>{
      this.listCatalog = data
      console.log(this.listCatalog)
    })
  }

  /*getProfileCandidateDailyCost(){
    const profilesFormArray = this.data.payload.profiles
    if(!this.data.isNew){
      for(let i=0; i< profilesFormArray.length; i++){
        console.log(profilesFormArray[i])
        let id = profilesFormArray[i].profileId
        console.log(id)
        this.catalogService.getProfile(id).subscribe((data: any) => {
        this.profileSource = data
        console.log(this.profileSource)
        profilesFormArray[i].profileId = this.profileSource
        }
      )}
    }
  }*/

  getPartnerByReqId(reqId: number){
    this.reqService.getPartnerByReqId(reqId).subscribe((data: any) => {
      this.partner = data
      console.log(this.partner)
      if(this.data.isNew){
        this.itemForm.get('partnerNum').patchValue(this.partner.id);
        this.itemForm.get('paymentMode').patchValue(this.partner.paymentMode);
        this.itemForm.get('paymentCondition').patchValue(this.partner.paymentCondition);
      }
      else{
        this.itemForm.get('partnerNum').patchValue(this.partner.id);
      }
    })
  }

  loadProfileByUpdatedProfile(profileId: number){
    this.catalogService.getProfile(profileId).subscribe((data: any) => {
      this.profile = data
      console.log(this.profile)
      console.log(this.data.payload.profiles)
      /*if(!this.data.isNew){
        const profilesFormArray = this.itemForm.get('profiles') as FormArray;
        profilesFormArray[0].get('profile').patchValue(this.profile)
        profilesFormArray[0].get('candidateDailyCost').patchValue(this.profile.candidateDailyCost)
      }*/
    })
  }

  getCatalogProfiles(catalogId: number){
    this.catalogService.getItemProfiles(catalogId).subscribe((data: any)=>{
      this.listProfiles = data
      this.profileId = this.data.profileId
    })
  }

  getCatalogByProfileId(profileId: number){
    this.catalogService.getCatalogByProfileId(profileId).subscribe((data: any) => {
      this.catalog = data
      console.log(this.catalog)
      this.itemForm.get('catalogNum').patchValue(this.catalog.id);
    })
  }



  loadQuotationReq(reqId: number){
    this.reqService.getItem(reqId).subscribe((data: any) => {
      this.req = data
      console.log(this.req)
      this.itemForm.get('requirementNum').patchValue(this.req.id);
      this.getPartnerByReqId(this.req.id)
    })
  }

  //////////////////////////////////////updates repeat form
  get myArrayControls() {
    return (this.myProfileForm.get('profiles') as FormArray).controls;
  }
  createRepeatForm(): FormGroup {
    return this._formBuilder.group({});
  }
  get repeatFormGroup() {
    return this.repeatForm.get('repeatArray') as FormArray;
  }
  handleAddRepeatForm() {
    this.repeatFormGroup.push(this.createRepeatForm());
  }
  handleRemoveRepeatForm(index: number) {
    this.repeatFormGroup.removeAt(index);
    if (index > 0) {
      const repeatArray = this.repeatForm.get('repeatArray') as FormArray;
      repeatArray.removeAt(index);
    }
  }
  

  removeProfileFormGroup(index: number): void {
    const profilesFormArray = this.itemForm.get('profiles') as FormArray;
    profilesFormArray.removeAt(index);
  }
  
  //////////////////////////////////////end updates repeat form

  submit() {
    console.log((this.itemForm.value))
    this.dialogRef.close(this.itemForm.value)
  }

  isResourcesRequirement() {
    const id = this.itemForm.get('requirementNum').value;
    const reqObservable: Observable<req> = this.reqService.getItem(id);
  
    return reqObservable.pipe(
      map((data: req) => data.requirementType),
      filter((requirementType) => requirementType !== null && requirementType === RequirementType.RESOURCE)
    );
  }

  isOtherPaymentMode(){
    const mode = this.itemForm.get('paymentMode').value
    return this.itemForm.get('paymentMode').value && mode == PaymentMode.OTHER
  }

  billingTypeMap = {
    [BillingType.DAILY] :'Par jour',
    [BillingType.DELIVERABLE]:'Par livrable',
    [BillingType.BY_TICKET]:'Par ticket'
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
    [PaymentMode.CHECK] :'Chèque',
    [PaymentMode.OTHER] :'Autre'
  }

  levelMap = {
    [Level.JUNIOR]: "Junior",
    [Level.CONFIRMED]: "Confirmé",
    [Level.SENIOR]: "Senior",
    [Level.EXPERT]: "Expert"
  }

  quotationStatusMap = {
    [QuotationStatus.IN_PROGRESS]: "En attente",
    [QuotationStatus.VALIDATED]: "Accepté",
    [QuotationStatus.REFUSED]: "Refusé",
    [QuotationStatus.UNANSWERED]: "Sans suite"
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
}
