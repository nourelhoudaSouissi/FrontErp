export interface Profile {
    id ?: number
    function ?: string;
    experience ?: Level
    candidateDailyCost ?: number
    comment?: string
    catalogId : number
}

export enum Level {
    JUNIOR="JUNIOR",
    CONFIRMED="CONFIRMED",
    SENIOR="SENIOR",
    EXPERT="EXPERT"
}