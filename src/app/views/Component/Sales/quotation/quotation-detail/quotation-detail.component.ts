import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { QuotationService } from '../quotation.service';
import { MatTableDataSource } from '@angular/material/table';
import { BillingType, Quotation, QuotationStatus } from 'app/shared/models/Quotation';
import { Currency, Partner, PaymentCondition, PaymentMode } from 'app/shared/models/Partner';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { UpdatedProfile } from 'app/shared/models/UpdatedProfile';
import { Level, Profile } from 'app/shared/models/Profile';
import { RequirementStatus, req } from 'app/shared/models/req';
import { ReqService } from '../../Requirement/req.service';
import { CrudPartnerService } from '../../partner/crudPartner.service';
import { ProfileCatalogService } from '../../profile-catalog/profile-catalog.service';
import { Catalog } from 'app/shared/models/Catalog';
import { address } from 'app/shared/models/address';
import { AddAddressService } from '../../add-address/add-address.service';

@Component({
  selector: 'app-quotation-detail',
  templateUrl: './quotation-detail.component.html',
  styleUrls: ['./quotation-detail.component.scss']
})
export class QuotationDetailComponent implements OnInit {
  private profileSelectionSubscription: Subscription | undefined;
  partner : Partner
  currencyCatalog : Catalog
  public myProfileForm: FormGroup;
  
  dataSource = new MatTableDataSource([]);
  billingTypes = Object.values(BillingType)
  paymentConditions = Object.values(PaymentCondition)
  paymentModes = Object.values(PaymentMode)
  currencies = Object.values(Currency)

  address : address
  listReq : req [] = []
  listCatalog : any[]
  listPartner : Partner [] = [] 
  listProfiles : Profile [] = []
  listAddress : address [] = []
  private profileId : number
  private reqId : number
  private selectedCatalogId : number
  private selectedReqId : number
  private selectedProfileId : number
  catalog : Catalog
  req : req
  private update: boolean = false

  selectedValue: string;
  showOptions: boolean = false;
  total = 0;
  vat = 0;
  showEditOption = false;
  isLoading = false;
  quotationForm: UntypedFormGroup;
  quotationFormSub: Subscription;
  quotationId: number;
  quotation: Quotation = {
    profiles: [],
    requirementTitle: '',
    requirementId: 0,
    partnerNum: null,
    partnerName: '',
    partnerId: null,
    comment: '',
    addressBuyer: '',
    orderId: 0,
    currency: '',
    catalogCurrency: ''
  };
profile : UpdatedProfile[];
  emptyFormObject: UpdatedProfile = {
    id: null,
    candidateNumber: null,
    function: '',
    experience: Level.JUNIOR,
    startDate: '',
    endDate: '',
    period: null,
    total: null,
    candidateDailyCost: null,
    comment: '',
    profile: null,
    profileId: null,
    quotationId: null
  };

  ProfilesTableColumns: string[] = [
    'candidateNumber',
    'period',
    'startDate',
    'endDate',
    'profileId',
    'experience',
    'candidateDailyCost',
    /*'tva',
    'priceWithoutTax',
    'priceWithAllTaxIncluded'*/
  ];

  constructor(
    private confirmService: AppConfirmService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private quotationService: QuotationService,
    private cdr: ChangeDetectorRef,
    private reqService: ReqService,
    private partnerService : CrudPartnerService,
    private catalogService: ProfileCatalogService,
    private addressService: AddAddressService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    console.log(this.dataSource)
    this.getReqList()
    this.getCatalogList()
    this.getPartnerList()
    /////////////END-OLD//////////////////
    this.quotationId = this.route.snapshot.params['id'];
    if (this.quotationId) {
      this.update = true
      this.getQuotation();
      this.showEditOption = false;
    } else {
      this.update = false
      this.buildQuotationForm();
      this.showEditOption = true;
    }
    
    // Add class for print media check _invoice.scss
    this.document.body.classList.add('print-body-content');
    console.log(this.dataSource)
    this.quotationForm.get('catalogNum').valueChanges.subscribe((selectedCatalogId: number) => {
      this.selectedCatalogId = selectedCatalogId;
      this.loadProfilesList();
      this.getCatalog()
    });
    this.quotationForm.get('requirementNum').valueChanges.subscribe((selectedReqId: number) => {
      this.selectedReqId = selectedReqId;
      this.getPartnerByReqId(selectedReqId)
      this.getRequirement(selectedReqId)
    });
  }

  ngOnDestroy() {
    this.document.body.classList.remove('print-body-content');
  }

  getQuotation() {
    this.quotationService.getQuotation(this.quotationId).subscribe((quotation: Quotation) => {
      this.quotation = quotation;
      console.log(quotation)
      this.getPartner(quotation.partnerNum)
      this.getAddress(parseInt(quotation.addressBuyer))
      this.buildUpdateQuotationForm(this.quotation);
      this.profilesEmptyList()
      this.cdr.markForCheck();
    });
  }

  getPartner(id : number) {
    this.partnerService.getItem(id).subscribe((data: any) => {
      this.partner = data;
      console.log(this.partner);
      console.log(this.partner.name)
    });
  }

  updateQuotation() {
    this.showEditOption = !this.showEditOption;
    
    
    this.loadQuotationAddress()
    this.getCatalogById(this.quotation.catalogNum);
    this.loadQuotationReq(this.quotation.requirementId);

    this.quotationForm.get('catalogNum').valueChanges.subscribe((selectedCatalogId: number) => {
      this.selectedCatalogId = selectedCatalogId;
      this.loadProfilesList();
      this.getCatalog()
    });
    //this.loadProfileByUpdatedProfile(this.quotation.profiles);
}
  

  buildQuotationForm(quotation?: any) {
    this.quotationForm = this.fb.group({
      billingType: [quotation ? quotation.billingType : ''],
      billingInstruction: [quotation ? quotation.billingInstruction : ''],
      addressBuyer: [quotation ? quotation.addressBuyer : ''],
      requirementNum: [quotation ? quotation.requirementNum : '' ],
      partnerNum: [ quotation ? { value: quotation.partnerNum, disabled: true } : ''],
      currency: [ quotation ? { value: quotation.currency, disabled: true } : ''],
      catalogCurrency: [ quotation ? { value: quotation.catalogCurrency, disabled: true } : ''],
      customerAgreement: [quotation ? quotation.customerAgreement : ''],
      catalogNum: [quotation ? quotation.catalogNum : ''],
      tva: [quotation ? quotation.tva : ''],
      htRevenue: [quotation ? quotation.htRevenue : 0],
      changeRate: [quotation ? quotation.changeRate : ''],
      discount: [quotation ? quotation.discount : ''],
      discountAmount: [quotation ? quotation.discountAmount : ''],
      revenue: [quotation ? quotation.revenue : ''],
      tvaCost: [quotation ? quotation.tvaCost : 0],
      revenueOrd: [quotation ? quotation.revenueOrd : 0],
      paymentCondition: [quotation ? quotation.paymentCondition : ''],
      paymentMode: [quotation ? quotation.paymentMode : ''],
      otherPaymentMode: [quotation ? quotation.otherPaymentMode : ''],      
      comment: [quotation ? quotation.comment : ''],
      profiles: this.fb.array(
        (quotation?.profiles || []).map(pro => this.fb.group({
          id: [pro.id || ''],
          candidateNumber: [pro.candidateNumber || ''],
          candidateDailyCost: [pro.candidateDailyCost || ''],
          period: [pro.period || ''],
          function: [pro.function || ''],
          experience: [pro.experience || ''],
          startDate: [pro.startDate || ''],
          total: [pro.total || ''],
          endDate: [pro.endDate || ''],
          comment: [pro.comment || ''],
          profile: [pro.profile || '']
        }))
      )
    });

  }

  buildUpdateQuotationForm(quotation?: any) {
    this.quotationForm = this.fb.group({
      billingType: [quotation ? quotation.billingType : ''],
      billingInstruction: [quotation ? quotation.billingInstruction : ''],
      addressBuyer: [quotation ? quotation.addressBuyer : ''],
      requirementNum: [quotation ? quotation.requirementId : '' ],
      partnerNum: [ quotation ? quotation.partnerNum : ''],
      currency: [ quotation ? quotation.currency : ''],
      catalogCurrency: [ quotation ? quotation.catalogCurrency : ''],
      customerAgreement: [quotation ? quotation.customerAgreement : ''],
      catalogNum: [quotation ? quotation.catalogNum : ''],
      tva: [quotation ? quotation.tva : ''],
      ref: [quotation ? quotation.ref : ''],
      quotationDate: [quotation ? quotation.quotationDate : ''],
      quotationStatus: [quotation ? quotation.quotationStatus : ''],
      htRevenue: [quotation ? quotation.htRevenue : 0],
      changeRate: [quotation ? quotation.changeRate : ''],
      discount: [quotation ? quotation.discount : ''],
      discountAmount: [quotation ? quotation.discountAmount : ''],
      revenue: [quotation ? quotation.revenue : ''],
      tvaCost: [quotation ? quotation.tvaCost : 0],
      revenueOrd: [quotation ? quotation.revenueOrd : 0],
      paymentCondition: [quotation ? quotation.paymentCondition : ''],
      paymentMode: [quotation ? quotation.paymentMode : ''],
      otherPaymentMode: [quotation ? quotation.otherPaymentMode : ''],      
      comment: [quotation ? quotation.comment : ''],
      profiles: this.fb.array(
        (quotation?.profiles || []).map(pro => this.fb.group({
          id: [pro.id || ''],
          candidateNumber: [pro.candidateNumber || ''],
          candidateDailyCost: [(pro.candidateDailyCost || '').toFixed(3)],
          period: [pro.period || ''],
          function: [pro.function || ''],
          experience: [pro.experience || ''],
          startDate: [pro.startDate || ''],
          total: [(pro.total || '').toFixed(3)],
          endDate: [pro.endDate || ''],
          comment: [pro.comment || ''],
          profileNum: [pro.profileId || '']
        }))
      )
    });

  }

  profilesEmptyList(): boolean{
    const profiles = this.quotationForm.get('profiles') as FormArray
    if(profiles.length == 0)
      return true
    else return false
  }

  addNewUpdatedProfile(profile?: UpdatedProfile) {
    
    const newFormGroup = this.fb.group({
      id: [profile ? profile.id : ''],
      candidateNumber: [profile ? profile.candidateNumber : ''],
      period: [profile ? profile.period : ''],
      startDate: [profile ? profile.startDate : ''],
      endDate: [profile ? profile.endDate : ''],
      candidateDailyCost: [profile ? profile.candidateDailyCost : ''],
      experience: [profile ? profile.experience : ''],
      total: [profile ? profile.total : ''],
      function: [profile ? profile.function : ''],
      profile: [profile? profile.profile : '']
    })
  this.getProfilesFormArray().push(newFormGroup);
  console.log('1')
  // Subscribe to value changes of 'profile' field
  this.profileSelectionSubscription?.unsubscribe();
  console.log('2')
  this.profileSelectionSubscription = newFormGroup.get('profile')?.valueChanges.subscribe((selectedProfileId: any) => {
    console.log('3')
    console.log('Selected Profile ID:', selectedProfileId);

    if (selectedProfileId) {
      const profile = this.listProfiles.find(p => p.id === selectedProfileId.id);
      console.log(profile)
      if (profile) {
        newFormGroup.patchValue({ candidateDailyCost: profile.candidateDailyCost * this.quotationForm.get('changeRate').value});
        newFormGroup.patchValue({ function: profile.function });
        newFormGroup.patchValue({ experience: profile.experience });
      }
    }
  });
}


  addUpdateNewUpdatedProfile(profile?: UpdatedProfile) {
    
      const newFormGroup = this.fb.group({
        id: [profile ? profile.id : ''],
        candidateNumber: [profile ? profile.candidateNumber : ''],
        period: [profile ? profile.period : ''],
        startDate: [profile ? profile.startDate : ''],
        endDate: [profile ? profile.endDate : ''],
        candidateDailyCost: [profile ? profile.candidateDailyCost : ''],
        experience: [profile ? profile.experience : ''],
        total: [profile ? profile.total : ''],
        function: [profile ? profile.function : ''],
        profileNum: [profile? profile.profileId : '']
      })
    this.getProfilesFormArray().push(newFormGroup);
    console.log('1')
    // Subscribe to value changes of 'profile' field
    this.profileSelectionSubscription?.unsubscribe();
    console.log('2')
    this.profileSelectionSubscription = newFormGroup.get('profileNum')?.valueChanges.subscribe((selectedProfileId: any) => {
      console.log('3')
      console.log('Selected Profile ID:', selectedProfileId);
  
      if (selectedProfileId) {
        const profile = this.listProfiles.find(p => p.id === selectedProfileId);
        console.log(profile)
        if (profile) {
          newFormGroup.patchValue({ candidateDailyCost: profile.candidateDailyCost * this.quotationForm.get('changeRate').value});
          newFormGroup.patchValue({ function: profile.function });
          newFormGroup.patchValue({ experience: profile.experience });
        }
      }
    });
  }
  
  getProfilesFormArray(): FormArray {
    return this.quotationForm.get('profiles') as FormArray;
  }

  updateForm(): boolean {
    if(this.update == true)
    return true
    else return false
  }
  

  deleteProfilesFromQuotation(index: number) {
    this.confirmService
      .confirm({ title: "Confirmer", message: "Voulez-vous supprimer ce profil ?" })
      .subscribe(res => {
        if (res) {
          this.getProfilesFormArray().removeAt(index);
        } else {
          return;
        }
      });
  }

  deleteProfilesFromQuotationUpdate(index: number) {
    this.getProfilesFormArray().removeAt(index);
  }
  
  
  
  saveQuotation() {
    if (this.quotationForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.quotation && this.quotation.id) {
      // Update existing invoice
      this.quotationService.updateQuotation(this.quotation.id, this.quotationForm.value)
        .subscribe( 
          (res: Quotation) => {
            
            this.quotation = res;
            this.isLoading = false;
            this.showEditOption = false;
            this.cdr.markForCheck();
            if (res) {
              this.router.navigateByUrl("/quotation/quotation-crud");
            }
          },
          (error: any) => {
            // Handle update error
            this.isLoading = false;
            console.error('Update quotation error:', error);
            // Show alert error
            alert('Veuillez vérifier le remplissage des données ou vérifier si un devis similaire existe déjà.');
            // Additional error handling logic
          }
        );
    } else {
      // Save new quotation
      this.quotationService.addQuotation(this.quotationForm.value)
        .subscribe(
          (res: Quotation) => {
            this.quotation = res;
            this.isLoading = false;
            this.showEditOption = false;
            this.cdr.markForCheck();
            if (res) {
              this.router.navigateByUrl('/quotation/' + res.id);
            }
          },
          (error: any) => {
            // Handle save error
            this.isLoading = false;
            console.error('Save quotation error:', error);
            // Show alert error
            alert('Veuillez vérifier le remplissage des données ou vérifier si une référence de devis similaire existe déjà.');
            // Additional error handling logic
          }
        );
    }
  }
  


  print() {
    window.print();
  }

  get quotationProfilesFormArray(): FormArray {
    return this.quotationForm.get('profiles') as FormArray;
  }

  get currency() {
    return this.quotationForm.get('currency').value
  }

  get htRevenue() {
    let sum = 0;
    this.quotationProfilesFormArray.controls.forEach((profiles: FormGroup) => {
      sum += profiles.get('candidateDailyCost').value * profiles.get('candidateNumber').value * profiles.get('period').value;
    });
    return sum;
  }

  get tvaCost() {
    let ttc = this.revenue
    let tva = this.quotationForm.get('tva').value
    return  ttc * tva/100
  }

  get discountAmount(){
    let ttc = this.htRevenue
    let discount = this.quotationForm.get('discount').value
    return ttc * discount/100
  }

  get revenue(){
    return this.htRevenue - this.discountAmount
  }

  get revenueOrd() {
    let ttc = this.revenue
    let tva = this.quotationForm.get('tva').value
    return  ttc + (ttc * tva/100)
  }

  get discount(){
    return this.quotationForm.get('discount').value
  }

  get tva(){
    return this.quotationForm.get('tva').value
  }

  getReqList(){
    this.reqService.getItems().subscribe((data :any )=>{
      this.listReq = data
      this.filterReqList()
    })
  }

  getPartnerList(){
    this.partnerService.getItems().subscribe((data :any )=>{
      this.listPartner = data
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
    this.loadProfileByUpdatedProfile(this.quotation.profiles)
  }

  getCatalog(){
    if(this.selectedCatalogId){
      this.catalogService.getItem(this.selectedCatalogId).subscribe((data: any) => {
        this.currencyCatalog = data 
        console.log(this.currencyCatalog)
        this.quotationForm.get('catalogCurrency').patchValue(this.currencyCatalog.currency);
      })
    }
  }

  getCatalogList(){
    this.catalogService.getItems().subscribe((data :any )=>{
      this.listCatalog = data
      console.log(this.listCatalog)
    })
  }

  getPartnerByReqId(reqId: number){
    this.reqService.getPartnerByReqId(reqId).subscribe((data: any) => {
      this.partner = data
      console.log(this.partner)
      this.listAddress = data.addresses
      console.log(this.listAddress);
      //if(this.data.isNew){
        this.quotationForm.get('partnerNum').patchValue(this.partner.id);
        this.quotationForm.get('paymentMode').patchValue(this.partner.paymentMode);
        this.quotationForm.get('paymentCondition').patchValue(this.partner.paymentCondition);
      /*}
      else{
        this.itemForm.get('partnerNum').patchValue(this.partner.id);
      }*/
    })
  }

  getAddress(id: number){
    this.addressService.getAddress(id).subscribe((data: any) => {
      this.address = data
      console.log(this.address)
    })
  }

  getRequirement(reqId: number){
    this.reqService.getItem(reqId).subscribe((data: any) => {
      this.req = data
      console.log(this.req)
      //if(this.data.isNew){
        this.quotationForm.get('currency').patchValue(this.req.currency);
      /*}
      else{
        this.itemForm.get('partnerNum').patchValue(this.partner.id);
      }*/
    })
  }

  getCatalogById(id: number){
    this.catalogService.getItem(id).subscribe((data: any) => {
      console.log(id)
      this.catalog = data
      console.log(this.catalog)
      this.quotationForm.get('catalogNum').patchValue(this.catalog.id);
      this.selectedCatalogId = this.catalog.id
      this.loadProfilesList()
    })
  }



  loadQuotationReq(reqId: number){
    this.reqService.getItem(reqId).subscribe((data: any) => {
      this.req = data
      console.log(this.req)
      this.quotationForm.get('requirementNum').patchValue(this.req.id);
      this.quotationForm.get('requirementNum').patchValue(this.req.id);
      this.getPartnerByReqId(this.req.id)
    })
    
  }

  loadQuotationAddress(){
    this.addressService.getAddress(parseInt(this.quotation.addressBuyer)).subscribe((data: any) => {
      const address = data
      this.quotationForm.get('addressBuyer').patchValue(address.id);
    })
  }
    

  loadProfileByUpdatedProfile(profilesC: any[]){
    let profileC : any
    const profilesD = this.quotationForm.get('profiles') as FormArray
    console.log(profilesD)
    console.log(profilesC)
      profilesD.controls.forEach((profileD: FormGroup) => {
        console.log('test')
        let i = 0
        let id = profilesC[i].profileId
        console.log(id)
        this.catalogService.getProfile(id).subscribe((data: any) => {
        profileC = data.id
        console.log(profileC)
        console.log(profileD)
        profileD.get('profile').patchValue(profileC)
        i += 1
      });
      
    })
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
  
  quotationStatusMap = {
    [QuotationStatus.IN_PROGRESS]: "En attente",
    [QuotationStatus.VALIDATED]: "Accepté",
    [QuotationStatus.REFUSED]: "Refusé",
    [QuotationStatus.UNANSWERED]: "Sans suite"
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
}
