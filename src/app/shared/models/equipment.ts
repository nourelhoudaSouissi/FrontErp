import { Employee } from "./Employee";

export class Equipment{
    id?:number;
    serialNumber?:string;
    reference?:string;
    type?:string;
    designation?:string;
    acquisitionDate?:Date;
    comment?:string;
    endDate?:Date;
    purchasePrise?:number;
    supplier?:string;
    status?:StatusDisponibility;
    disponibilityDate?:Date;
    motifUnavailability?:string;
    affectation?:Affectation;
    amortizable?:Boolean;
    supplierOrderNumber : string;
    affectable?:Boolean;
    purchaseMethod?:PurchaseMethod;
    amortizationType?:AmortizationType;
    currency?:Currency;
    returnDate?:Date;
    returnComment?:string;
    returnStatus?:string;
    emp?:any
    
}
export enum StatusDisponibility{
    AVAILABLE='AVAILABLE',
     UNAVAILABLE='UNAVAILABLE'
}
export enum Affectation {
    AFFECTED='AFFECTED',
    UNAFFECTED='UNAFFECTED'
}
export enum PurchaseMethod{
    PURCHASE ='PURCHASE',
    RENT='RENT'
}
export enum AmortizationType{
    LINEAR='LINEAR',
    DECLINING_BALANCE=' DECLINING_BALANCE',
    PROPORTIONAL='PROPORTIONAL',
    CONSTANT='CONSTANT',
    PROGRESSIVE='PROGRESSIVE',
    ANTICIPATORY='ANTICIPATORY'
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
