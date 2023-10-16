import { Partner } from "./Partner"

export interface BankAccount{
    id?: number
    bankName?: string
    rib?: number,
    bic?: string
    iban?: string
    bankAddress?: string
    partnerNum?: number,
    partner ?: Partner
}