import { CalendarMonth } from "./calendarMonth";
import { Holiday } from "./holiday";

export class Calendar  {
    id?: number;
    reference?: string;
    name?: string;
    description?: string;  
    startDate?:Date;
    endDate?:Date;
    accountingPeriod?:number;
    holidays:Holiday[];
    calendarMonths:CalendarMonth[]

} 
