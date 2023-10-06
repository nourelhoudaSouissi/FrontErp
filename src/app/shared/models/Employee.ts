import { LeaveType } from "./leaveType";

export class Employee {
    
    id?: number;
    lastName ?:string;
    firstName?:string;
     birthDate ?:string;
     emailOne ?:string;
     emailTwo ?:string;
     phoneNumberOne ?: number;
     phoneNumberTwo ?: number;
    address?:string;
     postCode ?: number;
     city ?: number;
    recommendationType ?: number;
    experience ?: number;
    experienceDetails ?:string;
    employeeFirstName ?:string;
    employeeLastName ?:string;
    employeeSerialNumber ?:string;
    civility?: Civility;
    title?: Title;
    employeeStatus?:EmployeeStatus;
    country?:Country;
    maritalSituation ?:MaritalSituation;
    provenance ?: Provenance;
    serialNumber?:string;
    socialSecurityNumber?:string;
    bankAccountNumber?:string;
    productivity?:number;
    photo?:string;
    workLocation?:WorkLocation;
    locationName?:string;
    resourceType?:ResourceType;
    recruitmentDate?:string;
    nationalIdentity?:string;
    departement?:Departement
    offers?: any[]
    recommendationMark:number;
    
    circoncisionLeaveRest: number;
    deathLeaveRest: number;
    marriageLeaveRest: number;
    maternityLeaveRest: number;
    remainingPaidLeaveRest: number;
    remainingPaidLeave: number;
    specialPaidLeaveRest: number;
    sicknessLeaveRest: number;
    sickLeaveRest: number;
    compassioateLeaveRest: number;
    remainingRecoveryLeaveRest: number;
    hireDate: Date;
    hierarchicalSuperiorNum: number;
    hierarchicalSuperior: Employee;
    leaveBalances: Map<LeaveType, number>;
    noteEvaluation : number;
    
}

export enum Departement{
    DEVELOPPEMENT = 'DEVELOPPEMENT' ,
    QUALITE ='QUALITE',
    ARCHITECTURE='ARCHITECTURE' ,
    DESIGN = 'DESIGN' ,
    TESTS = 'TESTS',
    RESSOURCES_HUMAINES ='RESSOURCES_HUMAINES' ,
    MARKETING ='MARKETING',
    VENTE ='VENTE',
    COMPTABILITE = 'COMPTABILITE',
    FINANCES ='FINANCES',
    JURIDIQUE ='JURIDIQUE' ,
    SUPPORT = 'SUPPORT'
} 
export enum ResourceType{
    EXTERNAL_RESOURCE = 'EXTERNAL_RESOURCE',
    BACKOFFICE_RESOURCE = 'BACKOFFICE_RESOURCE',
    INTERNAL_RESOURCE = 'INTERNAL_RESOURCE'}

export enum WorkLocation{
    MAIN ='MAIN' ,
    OTHER_LOCATION = 'OTHER_LOCATION'
}







export enum Provenance {
    LINKEDIN ='LinkedIn',
    SPONTANEOUS_APPLICATION ='Candidature spontanée',
    JOBS_FORUM ='Forum emploi',
    RECOMMENDATION ='Recommandation',
    JOBBOARD ='Site des offres ',
    OTHER ='Autre'
}
 ///----------employeeSarra&hala7lila
  


export interface Country {
    shortName?: string;
    name?: string;
  }

export enum Civility{
    MRS="MRS",
    MS="MS",
    MR="MR"
}
export enum Title{
    FRONT_END_DEVELOPER ="FRONT_END_DEVELOPER",
    BACK_END_DEVELOPER="BACK_END_DEVELOPER",
    FULLSTACK_DEVELOPER="FULLSTACK_DEVELOPER",
    CRM="CRM",
     HUMAN_RESOURCE_MANAGER="HUMAN_RESOURCE_MANAGER",
    HUMAN_RESOURCE="HUMAN_RESOURCE",
    PROJECT_MANAGER="PROJECT_MANAGER",
    TECH_LEAD="TECH_LEAD",
    UI_UX_DESIGNER="UI_UX_DESIGNER",
    QA_ENGINEER="QA_ENGINEER",
    DEVOPS_ENGINEER="DEVOPS_ENGINEER",
    WEB_DEVELOPER="WEB_DEVELOPER",
    OFFICE_MANAGER="OFFICE_MANAGER",
     ACCOUNTANT="ACCOUNTANT",
     SALES_REPRESENTATIVE="SALES_REPRESENTATIVE",
     CUSTOMER_SUPPORT_SPECIALIST="CUSTOMER_SUPPORT_SPECIALIST",
      MARKETING_COORDINATOR="MARKETING_COORDINATOR"
}
export enum EmployeeStatus{
    IN_PROCESS="IN_PROCESS",
    IN_PROGRESS="IN_PROGRESS",
    PRE_QUALIFIED="PRE_QUALIFIED",
    TOP_PROFILES="TOP_PROFILES",
    CONVERTED_TO_RESOURCE=" CONVERTED_TO_RESOURCE",
    DO_NOT_CONTACT=" DO_NOT_CONTACT",
    ARCHIVE="ARCHIVE"
}

export interface Country{
    shortName?: string;
    name?: string;
}
export enum MaritalSituation {
    SINGLE="SINGLE",
    MARRIED="MARRIED",
    DIVORCED="DIVORCED",
    WIDOWED="WIDOWED",
    COMPLICATED="COMPLICATED"
}
