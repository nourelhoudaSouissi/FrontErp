export interface Invoice {
  id?: number;
  invoiceNumber?: string;
  date?: string;
  currency?: Currency;
  nameBuyer?: string;
  addressBuyer?: string;
  nameSeller?: string;
  addressSeller?: string;
  totalAmount?:number;
  totalWithDiscount?:number;
  totalDiscount?:number;
  dueDate? : string;
  issueDate? : string;
  orderNumber? : string;
  invoiceEtat?: InvoiceEtat;
  invoiceType?: InvoiceType;
  paymentMethod?: PaymentMethod;
  additionalFees?: InvoiceAdditionalFees[];
}


export enum PaymentMethod {
  VIREMENT_BANCAIRE ="VIREMENT_BANCAIRE ",
  CHEQUE ="CHEQUE",
  TRAITE = "TRAITE",
  PAIMENT_ELECTRONIQUE = "PAIMENT_ELECTRONIQUE ",
  AUTRES ="AUTRES"
 

}

export interface InvoiceAdditionalFees {
  refFree?: string;
  designation?: string;
  unite?: string;  tva?: number;
  quantity?: number;
  cost?:number;
  discount?:number;
  priceWithAllTaxIncluded?:number;
  priceWithoutTax?:number;
  id?:number
}

export enum InvoiceEtat {
  EN_ATTENTE = "EN_ATTENTE",
  SOLDÉ = "SOLDÉ",
  En_COURS ="En_COURS"
}



export enum InvoiceType{
  FACTURE="FACTURE",
  AVOIR="AVOIR"
}


export interface Currency {
  shortName: string;
  name: string;
  description: string;
}
  
export enum CurrencyEnum {
  AFN = 'AFN - Afghan-Afghani',
  MGA = 'MGA - Malagasy Ariary',
  THB = 'THB - Thai Baht',
  PAB = 'PAB - Panamanian Balboa',
  ETB = 'ETB - Ethiopian Birr',
  VEF = 'VEF - Venezuelan Bolívar',
  BOB = 'BOB - Bolivian Boliviano',
  GHS = 'GHS - Ghanaian Cedi',
  CRC = 'CRC - Costa Rican Colón',
  SVC = 'SVC - Salvadoran Colón',
  NIO = 'NIO - Nicaraguan Córdoba',
  GMD = 'GMD - Gambian Dalasi',
  MKD = 'MKD - Macedonian Denar',
  DZD = 'DZD - Algerian Dinar',
  BHD = 'BHD - Bahraini Dinar',
  IQD = 'IQD - Iraqi Dinar',
  JOD = 'JOD - Jordanian Dinar',
  KWD = 'KWD - Kuwaiti Dinar',
  LYD = 'LYD - Libyan Dinar',
  RSD = 'RSD - Serbian Dinar',
  TND = 'TND - Tunisian Dinar',
  MAD = 'MAD - Moroccan Dirham',
  AED = 'AED - United Arab Emirates Dirham',
  AUD = 'AUD - Australian Dollar',
  BSD = 'BSD - Bahamian Dollar',
  BBD = 'BBD - Barbadian Dollar',
  BZD = 'BZD - Belize Dollar',
  BMD = 'BMD - Bermudian Dollar',
  BND = 'BND - Brunei Dollar',
  CAD = 'CAD - Canadian Dollar',
  XCD = 'XCD - East Caribbean Dollar',
  KYD = 'KYD - Cayman Islands Dollar',
  HKD = 'HKD - Hong Kong Dollar',
  FJD = 'FJD - Fijian Dollar',
  GYD = 'GYD - Guyanese Dollar',
  JMD = 'JMD - Jamaican Dollar',
  LRD = 'LRD - Liberian Dollar',
  NAD = 'NAD - Namibian Dollar',
  NZD = 'NZD - New Zealand Dollar',
  SGD = 'SGD - Singapore Dollar',
  SRD = 'SRD - Surinamese Dollar',
  TWD = 'TWD - New Taiwan Dollar',
  TTD = 'TTD - Trinidad and Tobago Dollar',
  USD = 'USD - United States Dollar',
  VND = 'VND - Vietnamese Đồng',
  AMD = 'AMD - Armenian Dram',
  STD = 'STD - São Tomé and Príncipe Dobra',
  NKR = 'NKR - Nagorno-Karabakh Republic Dram',
  CVE = 'CVE - Cape Verdean Escudo',
  EUR = 'EUR - Euro',
  HUF = 'HUF - Hungarian Forint',
  BIF = 'BIF - Burundian Franc',
  XAF = 'XAF - Central African CFA Franc',
  XOF = 'XOF - West African CFA Franc',
  XPF = 'XPF - CFP Franc',
  KMF = 'KMF - Comorian Franc',
  CDF = 'CDF - Congolese Franc',
  DJF = 'DJF - Djiboutian Franc',
  GNF = 'GNF - Guinean Franc',
  RWF = 'RWF - Rwandan Franc',
  CHF = 'CHF - Swiss Franc',
  HTG = 'HTG - Haitian Gourde',
  PYG = 'PYG - Paraguayan Guaraní',
  UAH = 'UAH - Ukrainian Hryvnia',
  LAK = 'LAK - Lao Kip',
  CZK = 'CZK - Czech Koruna',
  HRK = 'HRK - Croatian Kuna',
  MWK = 'MWK - Malawian Kwacha',
  ZMW = 'ZMW - Zambian Kwacha',
  MMK = 'MMK - Burmese Kyat',
  GEL = 'GEL - Georgian Lari',
  PGK = 'PGK - Papua New Guinean Kina',

  
}




