import { AdministrativeData } from "./AdministrativeData";
import { AssOfferCandidate } from "./AssOfferCandidate";

export interface Evaluation{
    id ?:number;
    evaluationRef?: string;
    evaluationDate?:string;
    globalAppreciation?: number;
    administrativeData?: AdministrativeData;
    offerCandidates?:AssOfferCandidate[];
   
}

 