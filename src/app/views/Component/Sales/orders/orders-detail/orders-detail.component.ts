import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationService } from '../../quotation/quotation.service';
import { ReqService } from '../../Requirement/req.service';
import { AddAddressService } from '../../add-address/add-address.service';
import { CrudPartnerService } from '../../partner/crudPartner.service';
import { ProfileCatalogService } from '../../profile-catalog/profile-catalog.service';
import { Level, Profile } from 'app/shared/models/Profile';
import { Currency, Partner, PaymentCondition, PaymentMode } from 'app/shared/models/Partner';
import { BillingType, Quotation, QuotationStatus } from 'app/shared/models/Quotation';
import { RequirementStatus, req } from 'app/shared/models/req';
import { MatTableDataSource } from '@angular/material/table';
import { Catalog } from 'app/shared/models/Catalog';
import { Subscription } from 'rxjs';
import { address } from 'app/shared/models/address';
import { UpdatedProfile } from 'app/shared/models/UpdatedProfile';
import { OrderService } from 'app/views/order/order.service';
import { Order } from 'app/shared/models/Order';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class OrdersDetailComponent implements OnInit {

  private profileSelectionSubscription: Subscription | undefined;
  partner : Partner
  currencyCatalog : Catalog
  public myProfileForm: FormGroup;
  profilesDataSource: MatTableDataSource<UpdatedProfile>;
  
  dataSource = new MatTableDataSource([]);
  billingTypes = Object.values(BillingType)
  paymentConditions = Object.values(PaymentCondition)
  paymentModes = Object.values(PaymentMode)
  currencies = Object.values(Currency)

  address : address
  listReq : req [] = []
  listQuotation : req [] = []
  listCatalog : any[]
  listPartner : Partner [] = [] 
  listProfiles : Profile [] = []
  profilesUpdated : UpdatedProfile [] = []
  listAddress : address [] = []
  private profileId : number
  private reqId : number
  private selectedCatalogId : number
  private selectedReqId : number
  private selectedQuotationId : number
  private selectedProfileId : number
  catalog : Catalog
  req : req
  quotation : Quotation
  private update: boolean = false

  selectedValue: string;
  showOptions: boolean = false;
  total = 0;
  vat = 0;
  showEditOption = false;
  isLoading = false;
  orderForm: UntypedFormGroup;
  orderFormSub: Subscription;
  orderId: number;
  order: Order = {
    /*profiles: [],
    requirementTitle: '',
    requirementId: 0,
    partnerNum: null,
    partnerName: '',
    partnerId: null,
    addressBuyer: '',*/
  };
/*profile : UpdatedProfile[];
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
  };*/

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
    //private confirmService: AppConfirmService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrdersService,
    private quotationService: QuotationService,
    private cdr: ChangeDetectorRef,
    private reqService: ReqService,
    private partnerService : CrudPartnerService,
    private catalogService: ProfileCatalogService,
    private addressService: AddAddressService,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.getQuotationList()
    console.log("1")
    this.getReqList()
    console.log("2")
    this.getCatalogList()
    console.log("3")
    this.getPartnerList()
    console.log("4")
    this.getAddressList()
    console.log("5")
    this.orderId = this.route.snapshot.params['id'];
    if (this.orderId) {
      this.getOrder();
      this.profilesDataSource = new MatTableDataSource(this.quotation.profiles);
      this.showEditOption = false;
    } else {
      this.buildOrderForm();
      this.showEditOption = true;
    }
    // Add class for print media check _invoice.scss
    this.document.body.classList.add('print-body-content');
    
    this.orderForm.get('quotationNum').valueChanges.subscribe((selectedQuotationId: number) => {
      this.selectedQuotationId = selectedQuotationId;
      this.loadquotationDetails(selectedQuotationId)
      console.log(this.selectedQuotationId)
      /*this.getReqByQotId(selectedQuotationId)
      this.getPartnerByReqId(selectedReqId)*/
      //this.getRequirement(selectedReqId)
    });
    /*this.orderForm.get('catalogNum').valueChanges.subscribe((selectedCatalogId: number) => {
      this.selectedCatalogId = selectedCatalogId;
      this.loadProfilesList();
      this.getCatalog()
    });*/
    this.orderForm.get('requirementNum').valueChanges.subscribe((reqId: number) => {
      this.reqId = reqId;
      this.getPartnerByReqId(reqId)
      console.log(this.selectedQuotationId)
      //this.loadQuotationAddress(this.selectedQuotationId)
      console.log(this.quotation)
    });
    this.orderForm.get('catalogNum').valueChanges.subscribe((catId: number) => {
      this.selectedCatalogId = catId;
      console.log(this.selectedCatalogId)
    });
  }

  ngOnDestroy() {
    this.document.body.classList.remove('print-body-content');
  }

  getOrder() {
    this.orderService.getOrder(this.orderId).subscribe((order: Order) => {
      this.order = order;
      console.log(order)
      this.loadOrderAddress(order)
      this.getPartner(order.partnerNum)
      this.getQuotation(order.quotationId)
      /*this.buildUpdateQuotationForm(this.quotation);
      this.profilesEmptyList()*/
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

  getQuotation(id : number) {
    this.quotationService.getQuotation(id).subscribe((data: any) => {
      this.quotation = data;
      this.profilesDataSource = new MatTableDataSource(this.quotation.profiles);
      console.log(this.quotation);
      console.log(this.partner.name)
      this.getAddress(parseInt(this.quotation.addressBuyer))
    });
  }

  /*updateOrder() {
    this.showEditOption = !this.showEditOption;
    
    
    this.loadOrderAddress()
    this.getCatalogById(this.order.catalogNum);
    this.loadQuotationReq(this.order.reqNum);

    this.orderForm.get('catalogNum').valueChanges.subscribe((selectedCatalogId: number) => {
      this.selectedCatalogId = selectedCatalogId;
      this.loadProfilesList();
      this.getCatalog()
    });
    //this.loadProfileByUpdatedProfile(this.order.profiles);
}*/
  

  buildOrderForm(order?: any) {
    this.orderForm = this.fb.group({
      billingType: [order ? order.billingType : ''],
      billingInstruction: [order ? order.billingInstruction : ''],
      addressBuyer: [order ? order.addressBuyer : ''],
      requirementNum: [order ? order.requirementNum : '' ],
      partnerNum: [ order ? { value: order.partnerNum, disabled: true } : ''],
      quotationNum: [ order ? order.quotationNum : ''],
      currency: [ order ? { value: order.currency, disabled: true } : ''],
      catalogCurrency: [ order ? { value: order.catalogCurrency, disabled: true } : ''],
      customerAgreement: [order ? order.customerAgreement : ''],
      catalogNum: [order ? order.catalogNum : ''],
      tva: [order ? order.tva : ''],
      htRevenue: [order ? order.htRevenue : 0],
      changeRate: [order ? order.changeRate : ''],
      discount: [order ? order.discount : ''],
      discountAmount: [order ? order.discountAmount : ''],
      revenue: [order ? order.revenue : ''],
      tvaCost: [order ? order.tvaCost : 0],
      revenueOrd: [order ? order.revenueOrd : 0],
      paymentCondition: [order ? order.paymentCondition : ''],
      paymentMode: [order ? order.paymentMode : ''],
      otherPaymentMode: [order ? order.otherPaymentMode : ''],      
      comment: [order ? order.comment : ''],
      profiles: this.fb.array(
        (this.quotation?.profiles || []).map(pro => this.fb.group({
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
          profileNum: [pro.profileId || '']
        }))
      )
    });

  }

  /*buildUpdateQuotationForm(quotation?: any) {
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
      profile: [profile? profile.profileId : '']
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
}*/


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
          newFormGroup.patchValue({ candidateDailyCost: profile.candidateDailyCost /* this.orderForm.get('changeRate').value*/});
          newFormGroup.patchValue({ function: profile.function });
          newFormGroup.patchValue({ experience: profile.experience });
        }
      }
    });
  }
  
  getProfilesFormArray(): FormArray {
    return this.orderForm.get('profiles') as FormArray;
  }

  /*updateForm(): boolean {
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
  }*/
  
  
  
  saveOrder() {
    if (this.orderForm.invalid) {
      return;
    }
    this.isLoading = true;
    // Save new order
    this.orderService.addOrder(this.orderForm.value)
      .subscribe(
        (res: Order) => {
          this.order = res;
          this.isLoading = false;
          this.showEditOption = false;
          this.cdr.markForCheck();
          if (res) {
            this.loadOrderAddress(res)
            this.router.navigateByUrl('/order/' + res.id);
          }
        },
        (error: any) => {
          // Handle save error
          this.isLoading = false;
          console.error('Save order error:', error);
          // Show alert error
          alert('Veuillez vérifier le remplissage des données ou vérifier si une référence de devis similaire existe déjà.');
          // Additional error handling logic
        }
      );
    }
  


  print() {
    window.print();
  }

  get orderProfilesFormArray(): FormArray {
    return this.orderForm.get('profiles') as FormArray;
  }

  get currency() {
    return this.orderForm.get('currency').value
  }

  get htRevenue() {
    let sum = 0;
    this.orderProfilesFormArray.controls.forEach((profiles: FormGroup) => {
      sum += profiles.get('candidateDailyCost').value * profiles.get('candidateNumber').value * profiles.get('period').value;
    });
    return sum.toFixed(3);
  }

  get tvaCost() {
    let ttc = parseFloat(this.revenue)
    let tva = this.orderForm.get('tva').value
    return  (ttc * tva/100).toFixed(3)
  }

  get discountAmount(){
    let ttc = parseFloat(this.htRevenue)
    let discount = this.orderForm.get('discount').value
    return (ttc * discount/100).toFixed(3)
  }

  get revenue(){
    return (parseFloat(this.htRevenue) - parseFloat(this.discountAmount)).toFixed(3)
  }

  get revenueOrd() {
    let ttc = parseFloat(this.revenue)
    let tva = this.orderForm.get('tva').value
    return  (ttc + (ttc * tva/100)).toFixed(3)
  }

  get discount(){
    return this.orderForm.get('discount').value
  }

  get tva(){
    return this.orderForm.get('tva').value
  }

  getReqList(){
    this.reqService.getItems().subscribe((data :any )=>{
      this.listReq = data
      this.filterReqList()
    })
  }

  getPartnerList(){
    this.partnerService.getItems().subscribe((data : Partner[] )=>{
      this.listPartner = data
    })
    console.log(this.listPartner)
  }

  getAddressList(){
    this.addressService.getAddresses().subscribe((data :any )=>{
      this.listAddress = data
      console.log(data)
    })
    console.log(this.listAddress)
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

  getQuotationList(){
    this.quotationService.getQuotations().subscribe((data :any )=>{
      this.listQuotation = data
      this.filterQuotationList()
    })
  }

  filterQuotationList(){
    this.listQuotation = this.listQuotation.filter((item: any) => {
      return (
        item.quotationStatus === QuotationStatus.VALIDATED && item.orderId == null
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
    } 
    /*else {
      this.listProfiles = []; // Clear the profiles list if no catalog is selected
    }
    this.loadProfileByUpdatedProfile(this.order.profiles)*/
  }

  getCatalog(){
    if(this.selectedCatalogId){
      this.catalogService.getItem(this.selectedCatalogId).subscribe((data: any) => {
        this.currencyCatalog = data 
        console.log(this.currencyCatalog)
        this.orderForm.get('catalogCurrency').patchValue(this.currencyCatalog.currency);
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
        this.orderForm.get('partnerNum').patchValue(this.partner.id);
        console.log(parseInt(this.quotation.addressBuyer))
        this.orderForm.get('addressBuyer').patchValue(parseInt(this.quotation.addressBuyer));
        /*this.orderForm.get('paymentMode').patchValue(this.partner.paymentMode);
        this.orderForm.get('paymentCondition').patchValue(this.partner.paymentCondition);
      }
      else{
        this.itemForm.get('partnerNum').patchValue(this.partner.id);
      }*/
    })
  }

  getReqByQotId(qotId: number){
    this.quotationService.getReqByQotId(qotId).subscribe((data: any) => {
      this.req = data
      console.log(this.req)
      //if(this.data.isNew){
        this.orderForm.get('reqNum').patchValue(this.req.id);
      /*}
      else{
        this.itemForm.get('partnerNum').patchValue(this.partner.id);
      }*/
    })
  }

  loadquotationDetails(qotId : number){
    this.quotationService.getQuotation(qotId).subscribe((data: any) => {
      this.quotation = data
      console.log(this.quotation)
      //if(this.data.isNew){
        this.orderForm.get('requirementNum').patchValue(this.quotation.requirementId);
        this.orderForm.get('billingType').patchValue(this.quotation.billingType);
        this.orderForm.get('billingInstruction').patchValue(this.quotation.billingInstruction);
        this.orderForm.get('currency').patchValue(this.quotation.currency);
        this.orderForm.get('catalogCurrency').patchValue(this.quotation.catalogCurrency);
        this.orderForm.get('catalogNum').patchValue(this.quotation.catalogNum);
        this.orderForm.get('addressBuyer').patchValue(this.quotation.addressBuyer);
        this.orderForm.get('tva').patchValue(this.quotation.tva);
        this.orderForm.get('htRevenue').patchValue(this.quotation.htRevenue);
        this.orderForm.get('changeRate').patchValue(this.quotation.changeRate);
        this.orderForm.get('discount').patchValue(this.quotation.discount);
        this.orderForm.get('discountAmount').patchValue(this.quotation.discountAmount);
        this.orderForm.get('revenue').patchValue(this.quotation.revenue);
        this.orderForm.get('tvaCost').patchValue(this.quotation.tvaCost);
        this.orderForm.get('revenueOrd').patchValue(this.quotation.revenueOrd);
        this.orderForm.get('paymentCondition').patchValue(this.quotation.paymentCondition);
        this.orderForm.get('paymentMode').patchValue(this.quotation.paymentMode);
        this.orderForm.get('otherPaymentMode').patchValue(this.quotation.otherPaymentMode);
        //this.orderForm.get('profiles').patchValue(this.quotation.profiles);
        console.log(this.quotation.profiles)
        this.quotation.profiles.forEach(element => {
          this.profilesUpdated.push(element)
        });
        console.log(this.selectedCatalogId)
        this.loadProfilesList()
        console.log(this.profilesUpdated)
        this.profilesUpdated.forEach(profile => {
          this.addUpdateNewUpdatedProfile(profile)
        })
      /*}
      else{
        this.itemForm.get('partnerNum').patchValue(this.partner.id);
      }*/
    })
  }

  /*loadQuotationAddress(qotId : number){
    this.quotationService.getQuotation(qotId).subscribe((data: any) => {
      this.quotation = data
      console.log(this.quotation)
      //if(this.data.isNew){
        this.orderForm.get('addressBuyer').patchValue(this.quotation.addressBuyer);
      /*}
      else{
        this.itemForm.get('partnerNum').patchValue(this.partner.id);
      }
    })
  }*/

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
        this.orderForm.get('currency').patchValue(this.req.currency);
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
      this.orderForm.get('catalogNum').patchValue(this.catalog.id);
      this.selectedCatalogId = this.catalog.id
      this.loadProfilesList()
    })
  }



  loadQuotationReq(reqId: number){
    this.reqService.getItem(reqId).subscribe((data: any) => {
      this.req = data
      console.log(this.req)
      this.orderForm.get('requirementNum').patchValue(this.req.id);
      this.orderForm.get('requirementNum').patchValue(this.req.id);
      this.getPartnerByReqId(this.req.id)
    })
    
  }

  loadOrderAddress(res : Order){
    this.quotationService.getQuotation(res.quotationId).subscribe((quotation : Quotation) =>{
      this.order.addressBuyer = quotation.addressBuyer
      console.log(this.order.addressBuyer)
      this.addressService.getAddress(parseInt(this.order.addressBuyer)).subscribe((data: any) => {
      const address = data
      this.address = address
    })
    })
  }
    

  /*loadProfileByUpdatedProfile(profilesC: any[]){
    let profileC : any
    const profilesD = this.orderForm.get('profiles') as FormArray
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
  }*/

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