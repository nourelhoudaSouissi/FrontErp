export class Weekend  {
    id?: number;
    reference?: string;
    name?: string;
    startDay?: DayOfWeek;
    endDay?: DayOfWeek;   
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
