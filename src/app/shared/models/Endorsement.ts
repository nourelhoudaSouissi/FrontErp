import { contract } from './contract';
export class Endorsement {
    id?: number;
    title ?:string;
    address ?:string;
    endorsementDate ?:Date;
    object?:string;
    note?:string;
    contractNum?:number;
    validityDate?:Date;
    status?:Status;
    contract?:contract;
}
export enum Status { 
    STILL_PENDING="STILL_PENDING",
    SENT="SENT",
    REFUSED="REFUSED",
    ACCEPTED="ACCEPTED",
    EXPIRED="EXPIRED"
}