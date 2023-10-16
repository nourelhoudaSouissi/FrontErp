import { Currency } from "./Partner"

export interface Catalog {
    id ?: number
    year ?: number
    startDate ?: Date
    endDate ?: Date
    title ?: string
    ref ?: string
    currency ?: Currency
    creationDate ?: string
    comment?: string
}