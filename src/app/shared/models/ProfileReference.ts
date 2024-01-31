export interface ProfileReference {
   
    id ?: number
    function ?: string;
    experience ?: Experience
    description?: string
    yearsOfExperience ?:number
    technologie ?: string
   
}
export enum Experience {
    JUNIOR="JUNIOR",
    CONFIRMED="CONFIRMED",
    SENIOR="SENIOR",
    EXPERT="EXPERT"
}