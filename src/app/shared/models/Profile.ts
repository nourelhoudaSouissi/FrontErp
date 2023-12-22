import { CalculationUnit } from "./CalculationUnit";
import { ProfileDomain } from "./ProfileDomain";

export interface Profile {
    id ?: number
    function ?: string;
    experience ?: Level
    candidateDailyCost ?: number
    comment?: string
    yearsOfExperience ?:number
    technologie ?: string
    isActif ?: boolean
    activationDate ?: Date
    deativationDate ?: Date
    profileDomain ?: ProfileDomain
    profileDomainNum ?: number
    catalogId : number
    calculationUnitId?: number
    calculationUnit ?: CalculationUnit
}

export enum Level {
    JUNIOR="JUNIOR",
    CONFIRMED="CONFIRMED",
    SENIOR="SENIOR",
    EXPERT="EXPERT"
}