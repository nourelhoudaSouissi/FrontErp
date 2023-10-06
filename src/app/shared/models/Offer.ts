import { AssOfferCandidate } from "./AssOfferCandidate";

export interface Offer{
    id ?:number;
    title ?:string;
    reference ?:string;
    jobSite ?: string;
    description ?:string;
    requiredSkills?:string;
    requiredExperienceAmount?:string;
    startDate?:string;
    endDate?:string;
    candidature ?: AssOfferCandidate[]
}