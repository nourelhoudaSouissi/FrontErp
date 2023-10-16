import { Partner } from "./Partner";

export interface offeredService {
    id :number;
    title :string;
    partnerNum :number
    serviceType: ServiceType
    partner: Partner
}

export enum ServiceType {
    RH="RH" ,
    R_AND_D ="R_AND_D", 
    FINANCE="FINANCE" , 
    DEVELOPMENT="DEVELOPMENT"
}