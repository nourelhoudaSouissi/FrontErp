import { Service } from "./Service"

export interface ServiceUpdated {
    id ?: number
    title ?: string
    amount ?: number
    code?:string
    catalogType?:CatalogType

    startDate ?:string
    endDate ?: string
    period ?: number
    serviceQuantity?: number;

    total: number;
    totalTva: number;
    tvaPercentage: number;
    totalDiscount: number;
    serviceDiscount: number;
    comment?: string
   
    service : Service
    serviceId : number
    quotationId : number
}
export enum CatalogType {
    RESOURCE="RESOURCE",
    SERVICE="SERVICE"
}