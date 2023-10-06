export interface contact {
    id :number;
    firstName :string;
    lastName: string;
    function: string;
    emailOne:string;
    emailTwo:string;
    comment:string;
    phoneNumberOne:number ;
    phoneNumberTwo:number ;
    partnerNum :number 
    partnerId :number
    privilege: Privilege
    civility: Civility
    service: Service
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