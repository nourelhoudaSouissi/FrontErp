import { Partner } from "./Partner";

export interface address {
    id ?: number ,
    num ?: number
    street ?: string, 
    postalCode?: number,
    city ?: string ,
    region ?: string ,
    country ?: string,
    type ?: string,
    partnerNum?: number
}

export enum AddressType {
    HEADQUARTER = "HEADQUARTER",
    SUBSIDIARY = "SUBSIDIARY" 
}