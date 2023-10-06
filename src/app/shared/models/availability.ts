export class availability {
    startDate?:Date;
    endDate?:Date;
    period?:number;
    comment?:string;
    motifUnavailability?:MotifUnavailability;
    employeeNum?:number;
}

export enum MotifUnavailability {
   TRAINING="TRAINING",
   LEAVE ="LEAVE",
   DISEASE ="DISEASE",
   PROJECT ="PROJECT"
}