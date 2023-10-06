export interface AssOfferCandidate{
    id ?:number;
    employeeNum ?:number;
    offerNum ?:number;
    applicationDate ?:number;
    experienceLevel ?: ExperienceLevel
    
}

export enum ExperienceLevel{
    INTERN="INTERN",
    JUNIOR="JUNIOR",
    MID_LEVEL="MID_LEVEL",
    SENIOR="SENIOR",
    EXPERT="EXPERT"
}