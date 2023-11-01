import { Disbursement } from "./Disbursement.model";
import { Caisse } from "./caisse.model";
import { Tresorerie } from "./tresorerie.model";

export interface Rapprochement {
    [x: string]: any;
    id?: number;
    bankNumber?:string;
    issueDate?:string;
    company?:string;
    iban?:string;
    rapprochementEtat?: RapprochementEtat ;
    collection :  Tresorerie ;
    disbursement : Disbursement;
    treasury : Caisse ;

  }

  export enum RapprochementEtat {
    NON_RAPPROCHÉ = "NON_RAPPROCHÉ",
    RAPPROCHÉ = "RAPPROCHÉ"

  }