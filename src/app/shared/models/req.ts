import { Currency, Partner } from "./Partner";

export interface req {
    ref?: string
 
    company : string

   
    totalBudget?: number
    currency?: Currency
    candidateNumber?: number
    budgetingType?: BudgetingType
    paymentType? :PaymentType;
   
    closureDate ?:string
   
    creationDate? :string
    partnerName? : string
    partner: Partner
   
    comment: string

    id ?:number;
    title?: string;
    description? : number;
    criteria?: string;
    requirementType :RequirementType;
    requirementStatus ?:RequirementStatus,
    workField ?:WorkField,
    availability:Availability;
    plannedBudget?: number,
    plannedIncome?: number,
    startDate? :string ,
    expectedEndDate? :string ,
    responseDate? :string ,
    totalCandidateNumber : number,
    partnerNum :number ,
    partnerId :number
  
}

export enum Availability {

    FROM="FROM",
     IMMEDIATELY="IMMEDIATELY",
      ASAP="ASAP"
}

export enum PaymentType {
    FOR_SETTLEMENT = "FOR_SETTLEMENT",
    IN_PACKAGE = "IN_PACKAGE"
}

export enum RequirementType {
    RESOURCE = "RESOURCE",
    PROJECT = "PROJECT"
}
export enum BudgetingType {
    PROPOSED_BUDGET = "PROPOSED_BUDGET",
    ESTIMATED_BUDGET = "ESTIMATED_BUDGET"
}

export enum RequirementStatus {
    OPEN = "OPEN",
    IN_PROGRESS="IN_PROGRESS",
    CLOSED ="CLOSED",
    PARTIALLY_WON = "PARTIALLY_WON" ,
    PARTIALLY_LOST="PARTIALLY_LOST" ,
    TOTALLY_WON="TOTALLY_WON" ,
    TOTALLY_LOST="TOTALLY_LOST" ,
    ABANDONED ="ABANDONED"
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