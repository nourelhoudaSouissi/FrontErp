export interface Partner {
     id ?:number;
    name?: string;
    staffNumber? : number;
    parentCompany?: string;
    ceoName ?: string;
    phoneNumber? :number;
    phoneNumberTwo ?: number;
    postCode?: number ;
    city? : string;
    description ?: string ;
    logo ?: string ;
    activityStartDate? : string;
    partnerShipDate ?: string;
    companyStatus ?:CompanyStatus,
    refPhoneNumber?: number,
    country? :string ,
    workField ?:WorkField,
    legalStatus?:LegalStatus,
    provenance?:Provenance,


  }



  
  export interface Country {
    shortName: string;
    name: string;
  }

  export enum CompanyStatus {

    PROSPECT ="PROSPECT"
     , SUPPLIER = "SUPPLIER"
      , CLIENT ="CLIENT"
       , ARCHIVED = "ARCHIVED"
  }



  export enum WorkField {

    IT = "IT",
    INDUSTRY= "INDUSTRY", 
    SALES="SALES",
     AGRICULTURE="AGRICULTURE",
      BANKING="BANKING",
       E_COM="E_COM", 
       ASSURANCE="ASSURANCE",
        FINANCE="FINANCE"
  }

  export enum LegalStatus {

    TVA ="TVA",
     SIRET="SIRET" ,
      RCS ="RCS", 
      CODE_APE="CODE_APE"
  }

  export enum Provenance {

    LINKEDIN ="LINKEDIN",
     SPONTANEOUS_APPLICATION="SPONTANEOUS_APPLICATION" ,
      JOBS_FORUM="JOBS_FORUM" ,
       RECOMMENDATION="RECOMMENDATION" ,
        JOB_BOARD ="JOB_BOARD",
         COOPERATION ="COOPERATION",
         OTHER="OTHER"
  }


