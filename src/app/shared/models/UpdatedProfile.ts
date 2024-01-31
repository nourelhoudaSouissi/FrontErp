import { Level, Profile } from "./Profile";

export interface UpdatedProfile {
    id ?: number
    candidateNumber ?: number
    function ?: string
    experience ?: Level
    startDate ?:string
    endDate ?: string
    period ?: number
    candidateDailyCost?: number
    total: number;
    totalDiscount: number;
    profileDiscount: number;
    totalTva: number;
    tvaPercentage: number;
    comment?: string
    profile : Profile
    profileId : number
    quotationId : number
}