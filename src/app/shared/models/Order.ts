export interface Order {

    id :number ;
    orderRef : string;
    orderStatus:OrderStatus;
    customerAgreement : boolean;
    orderDate :string;
    phobillingTypenep:BillingType;
    billingInstruction: string;
    tva :number;
    paymentCondition :PaymentCondition;
    paymentMode :PaymentMode ;
    bankDetail :string;
    orderRevenue:number;


}

export enum OrderStatus {
  IN_PROGRESS ="IN_PROGRESS",
  VALIDATED="VALIDATED",
  REFUSED="REFUSED"
  }

 export enum BillingType {
  DAILY ="DAILY",
  HOURLY="HOURLY",
  FIXED="FIXED"
  }

  export enum PaymentCondition {
    IMMEDIATE ="IMMEDIATE",
    ADVANCED="ADVANCED"
  }

  export enum PaymentMode {
    CASH ="CASH",
    CREDIT="CREDIT",
    PAYPAL="PAYPAL"
  }