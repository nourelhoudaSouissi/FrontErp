import { CalculationUnit } from "./CalculationUnit"
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
    calculationUnitId?: number
    calculationUnit ?: CalculationUnit
    
}
export enum CatalogType {
    RESOURCE="RESOURCE",
    SERVICE="SERVICE"
}