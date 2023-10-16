import { UpdatedProfile } from "./UpdatedProfile"

export class Quotation {
    id?: number
    ref?: string
    quotationStatus?: string
    requirementTitle: string
    customerAgreement?: boolean
    quotationDate?: string
    billingType?: string
    billingInstruction?: string
    catalogNum?: number
    tva?: number
    tvaCost?: number
    changeRate?: number
    discountAmount?: number
    discount?: number
    paymentCondition?: string
    paymentMode?: string
    otherPaymentMode?: string
    htRevenue?: number
    revenueOrd?: number
    revenue?: number
    requirementId: number
    partnerId: number
    partnerNum: number
    addressBuyer: string
    partnerName: string;
    currency: string;
    catalogCurrency: string;
    comment : string
    orderId: number
    profiles?: UpdatedProfile[]
}

export enum QuotationStatus{
    IN_PROGRESS = "IN_PROGRESS",
    VALIDATED = "VALIDATED",
    REFUSED = "REFUSED",
    UNANSWERED = "UNANSWERED"
}

export enum BillingType{
    DAILY = "DAILY",
    DELIVERABLE = "DELIVERABLE",
    BY_TICKET = "BY_TICKET"
}

