export class WeekendUpdated  {
    id?: number;
    reference?: string;
    name?: string;
    startDay?: DayOfWeek;
    endDay?: DayOfWeek;  
    activationStartDate?:Date;
    activationEndDate?:Date; 
} 


export enum DayOfWeek{
    MONDAY = "MONDAY", 
    TUESDAY = "TUESDAY", 
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY", 
    FRIDAY = "FRIDAY", 
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY" 
}
