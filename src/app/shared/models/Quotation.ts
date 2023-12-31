import { ServiceUpdated } from "./ServiceUpdated"
import { UpdatedProfile } from "./UpdatedProfile"

export class Quotation {
    id?: number
    ref?: string
    quotationStatus?: string
    requirementTitle: string
    customerAgreement?: boolean
    quotationDate?: string
    billingType?: string
    //billingInstruction?: string
    catalogNum?: number
    tva?: number
    tvaCost?: number
    changeRate?: number
    discountAmount?: number
    discount?: number
    paymentCondition?: string
    legalIdentifier ?: number
    paymentMode?: string
    otherPaymentMode?: string
    htRevenue?: number
    htRevenueRemiseProfile?: number
    limitDuration?: number
    revenueOrd?: number
    revenue?: number
    requirementId: number
    partnerId: number
    partnerNum: number
    addressBuyer: string
    contactBuyer : string
    partnerName: string;
    currency: string;
    catalogCurrency: string;
    comment : string
    orderId: number
    profiles?: UpdatedProfile[]

    services?: ServiceUpdated[]
}

export enum QuotationStatus{
    IN_PROGRESS = "IN_PROGRESS",
    VALIDATED = "VALIDATED",
    REFUSED = "REFUSED",
    UNANSWERED = "UNANSWERED",
    SENT_TO_CLIENT= "SENT_TO_CLIENT"
}

export enum BillingType{
    DAILY = "DAILY",
    DELIVERABLE = "DELIVERABLE",
    BY_TICKET = "BY_TICKET"
}

