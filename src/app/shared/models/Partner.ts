import { PaymentTerm } from "./PaymentTerm";
import { address } from "./address";
import { contact } from "./contact";
import { req } from "./req";

export interface Partner {


  phoneNumberTwo ?: number;
  workField ?:WorkField,
  provenance?:Provenance,

    id ?:number;
    name?: string;
    ref?: number;
    refs?: string[];
    legalIdentifier: number
    tvaIdentifier: number
    nafCode: number
    staffNumber? : number;
    parentCompany?: string;
    ceoName ?: string;
    phoneNumber? :number;
    mobilePhoneNumber ?: number;
    postCode?: number ;
    city? : string;
    description ?: string ;
    logo ?: string ;
    email ?: string;
    webSite ?: string;
    foundedSince ?: string;
    activityStartDate? : string;
    activityEndDate? : string;
    partnerShipDate ?: string;
    creationDate ?: string;
    companyStatus ?:CompanyStatus;
    refPhoneNumber?: number;
    country? :string;
    legalStatus?:LegalStatus;
    blocked?: boolean;
    insurancePolicy?: string;
    insuranceCompany?: string;
    comment?: string;
    controlType?: string;
    inProgressAuthorized?: number;
    capital?: number;
    classification?: Privilege;
    paymentCondition?: string;
    paymentMode?: string;
    externalReference ?: number;
    toleranceRate ?: number;
    addresses?: address[];
    contacts?: contact[];
    currency?: Currency;
    isTaxable?: boolean;
    requirements?:req[];
    paymentTerm?:PaymentTerm; 
    paymentTermId ?:number
    //paymentTermNum?:number
  }

  export interface Country {
    shortName: string;
    name: string;
  }

  export enum Privilege {

    HIGH ="HIGH"
    , MEDIUM ="MEDIUM",
     LOW="LOW"
}

  export enum CompanyStatus {

    PROSPECT ="PROSPECT", 
    SUPPLIER = "SUPPLIER", 
    CLIENT ="CLIENT", 
    CLIENT_SUPPLIER = "CLIENT_SUPPLIER",
    ARCHIVED = "ARCHIVED",
    INTERN_GROUP= "INTERN_GROUP"
  }



  export enum WorkField {

    IT = "IT",
    INDUSTRY= "INDUSTRY", 
    SALES="SALES",
     AGRICULTURE="AGRICULTURE",
      BANKING="BANKING",
       E_COM="E_COM", 
       ASSURANCE="ASSURANCE",
        FINANCE="FINANCE"
  }

  export enum LegalStatus {
    SARL = "SARL",
    SA = "SA",
    SUARL = "SUARL",
    SP = "SP",
    FREELANCE ="FREELANCE"
  }

  export enum Provenance {
    JOBS_FORUM="JOBS_FORUM" ,
    RECOMMENDATION="RECOMMENDATION" ,
    COOPERATION ="COOPERATION",
    OTHER="OTHER"
  }

  export enum PaymentMode {
    CASH="CASH" ,
    CREDIT="CREDIT" ,
    DEBIT_CARD ="DEBIT_CARD",
    BANK_TRANSFER="BANK_TRANSFER",
    PAYPAL="PAYPAL",
    CHECK="CHECK",
    OTHER="OTHER"
  }

  export enum PaymentCondition {
    IMMEDIATE="IMMEDIATE" ,
    ADVANCED="ADVANCED" ,
    ORDER ="ORDER",
    ON_DELIVERY="ON_DELIVERY",
    _30_DAYS="_30_DAYS",
    _60_DAYS="_60_DAYS",
    _90_DAYS="_90_DAYS",
    IN_TERM="IN_TERM",
    ADVANCE="ADVANCE",
    AT_REQUEST="AT_REQUEST"
  }

  export enum Currency {
    AFN = 'AFN',
    AMD = 'AMD',
    AUD = 'AUD',
    BSD = 'BSD',
    BBD = 'BBD',
    BZD = 'BZD',
    BMD = 'BMD',
    BND = 'BND',
    BIF = 'BIF',
    KHR = 'KHR',
    CAD = 'CAD',
    CVE = 'CVE',
    KYD = 'KYD',
    XAF = 'XAF',
    XPF = 'XPF',
    CLP = 'CLP',
    CNY = 'CNY',
    COP = 'COP',
    KMF = 'KMF',
    CRC = 'CRC',
    HRK = 'HRK',
    CZK = 'CZK',
    DKK = 'DKK',
    DJF = 'DJF',
    DOP = 'DOP',
    EGP = 'EGP',
    ETB = 'ETB',
    EUR = 'EUR',
    FKP = 'FKP',
    FJD = 'FJD',
    GMD = 'GMD',
    GEL = 'GEL',
    GHS = 'GHS',
    GIP = 'GIP',
    GTQ = 'GTQ',
    GNF = 'GNF',
    GYD = 'GYD',
    HTG = 'HTG',
    HNL = 'HNL',
    HKD = 'HKD',
    HUF = 'HUF',
    ISK = 'ISK',
    INR = 'INR',
    IDR = 'IDR',
    IRR = 'IRR',
    IQD = 'IQD',
    ILS = 'ILS',
    JPY = 'JPY',
    JOD = 'JOD',
    KZT = 'KZT',
    KES = 'KES',
    KWD = 'KWD',
    LAK = 'LAK',
    LBP = 'LBP',
    LRD = 'LRD',
    MGA = 'MGA',
    MWK = 'MWK',
    MYR = 'MYR',
    MUR = 'MUR',
    MXN = 'MXN',
    MDL = 'MDL',
    MNT = 'MNT',
    MAD = 'MAD',
    MZN = 'MZN',
    MMK = 'MMK',
    NAD = 'NAD',
    NPR = 'NPR',
    ANG = 'ANG',
    NZD = 'NZD',
    NIO = 'NIO',
    NGN = 'NGN',
    NOK = 'NOK',
    OMR = 'OMR',
    PKR = 'PKR',
    PAB = 'PAB',
    PGK = 'PGK',
    PYG = 'PYG',
    PEN = 'PEN',
    PHP = 'PHP',
    PLN = 'PLN',
    QAR = 'QAR',
    RON = 'RON',
    RUB = 'RUB',
    RWF = 'RWF',
    SHP = 'SHP',
    SVC = 'SVC',
    SAR = 'SAR',
    RSD = 'RSD',
    SCR = 'SCR',
    SLL = 'SLL',
    SGD = 'SGD',
    SOS = 'SOS',
    ZAR = 'ZAR',
    KRW = 'KRW',
    SSP = 'SSP',
    LKR = 'LKR',
    SDG = 'SDG',
    SRD = 'SRD',
    SZL = 'SZL',
    SEK = 'SEK',
    CHF = 'CHF',
    SYP = 'SYP',
    TWD = 'TWD',
    TZS = 'TZS',
    THB = 'THB',
    TOP = 'TOP',
    TTD = 'TTD',
    TND = 'TND',
    TRY = 'TRY',
    TMT = 'TMT',
    AED = 'AED',
    UGX = 'UGX',
    UAH = 'UAH',
    UYU = 'UYU',
    UZS = 'UZS',
    VUV = 'VUV',
    VEF = 'VEF',
    VND = 'VND',
    XOF = 'XOF',
    YER = 'YER',
    ZMW = 'ZMW',
    ZWL = 'ZWL',
  }

  export enum ControlType{
    OFFER_CONTROL = 'OFFER_CONTROL',
    ORDER_CONTROL = 'ORDER_CONTROL'  
  }

  export enum BlockingReason{
    NON_PAYMENT = 'NON_PAYMENT',
    DISPUTE = 'DISPUTE',
    DEFINITIVE_CLOSURE = 'DEFINITIVE_CLOSURE',
    OTHER = 'OTHER'
  }
  
  
  


