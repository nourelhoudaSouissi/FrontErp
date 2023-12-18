import { TvaCode } from "./TvaCode"

export interface Service {
    id ?: number
    title ?: string
    amount ?: number
    code?:string
    catalogType?:CatalogType
    comment?:string
    catalogId : number
    tvaCodeId?: number
    tvaCode ?: TvaCode
    tvaPercentage ?: number
}
export enum CatalogType {
    RESOURCE="RESOURCE",
    SERVICE="SERVICE"
}