import { CalculationUnit } from "./CalculationUnit";
import { ProfileDomain } from "./ProfileDomain";
import { TvaCode } from "./TvaCode";

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
    profileDomainId ?: number
    catalogId : number
    calculationUnitId?: number
    calculationUnit ?: CalculationUnit
    tvaCode ?: TvaCode
    tvaPercentage ?: number
}

export enum Level {
    JUNIOR="JUNIOR",
    CONFIRMED="CONFIRMED",
    SENIOR="SENIOR",
    EXPERT="EXPERT"
}