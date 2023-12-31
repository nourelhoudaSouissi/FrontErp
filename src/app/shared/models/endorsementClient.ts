import { contractClient } from "./contractClient";

export class endorsementClient{
    id?: number;
    title ?:string;
    nationalBRNumber?:string;
    address ?:string;
    endorsementDate ?:Date;
    object?:string;
    note?:string;
    contractId?:number;
    contract?:contractClient;
    refContract?: string
}