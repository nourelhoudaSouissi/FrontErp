import { Partner } from "./Partner";

export interface contact {
    contactId :number;
    firstName :string;
    lastName: string;
    fullName: string;
    function: string;
    localisation: string
    email:string;
    emailTwo:string;
    comment:string;
    phoneNumber:number ;
    mobilePhoneNumber:number ;
    company ?: string;
    partner ?: Partner 
    partnerId ?:number
    privilege ?: Privilege
    civility: Civility
    service: string
    societe : string
    appointmentMaking: boolean
    privilegedContact: boolean
    
}

export enum Privilege {

    HIGH ="HIGH"
    , MEDIUM ="MEDIUM",
     LOW="LOW"
}

export enum Civility {

    MRS="MRS" ,
     MS="MS" ,
      MR="MR"
}

export enum Service {

    RH="RH" ,
     R_AND_D ="R_AND_D", 
     FINANCE="FINANCE" , 
     DEVELOPEMENT="DEVELOPEMENT"
}