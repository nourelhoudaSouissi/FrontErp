import { articleClient } from './articleClient';

export class contractClient{
    id?:number;
    titleContract?:string;
    reference?: string;
    dateContract?:Date;
    lieuContract?:string;
    startDate?:Date;
    endDate?:Date;
    introductionSoc?:string;
    introductionClient?:string;
    contractStatus?:ContractStatus;
    contractType?:ContractClientType;
    articleClients?: articleClient[];


}

export enum ContractClientType{
    CONTRACT_COSTUMER="CONTRACT_COSTUMER",
    CONTRACT_SUPPLIER="CONTRACT_SUPPLIER"
}
export enum ContractStatus{
    STILL_PENDING="STILL_PENDING",
    SENT="SENT",
    REFUSED="REFUSED",
    ACCEPTED="ACCEPTED"
  
  }