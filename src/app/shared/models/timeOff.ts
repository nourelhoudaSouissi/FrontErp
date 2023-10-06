import { Employee } from "./Employee";
import { LeaveType } from "./leaveType";

export class TimeOff  {
    id?: number;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    timeOffPeriod?: number;
    comment?:string;
    requestInputDate?:Date;
    requestStatus?:RequestStatus;
    validationDate?:Date;
    externalTimeOffType?:ExternalTimeOffType;
    justificationDoc?: string;
    timeOffPeriodType?:TimeOffPeriodType;
    timeOfTimeType?:TimeOfTimeType;
    employee?:Employee;
    remainingPaidLeave?: number;
    leaveType?:LeaveType;
    leaveTypeAlertNumberDays?:number;

    
}



 

export enum RequestStatus{
    VALIDATED = 'VALIDATED',
    REJECTED = 'REJECTED', 
    PENDING = 'PENDING'

  }

  export enum ExternalTimeOffType{
    STILL_PENDING,
    REFUSED,
    ACCEPTED
  
  }
  export enum TimeOffPeriodType{
    HALF_DAY = "HALF_DAY", 
    QUARTER_DAY = "QUARTER_DAY", 
    FULL_DAY = "FULL_DAY"
  
  }
  export enum TimeOfTimeType{
    MORNING = "MORNING", 
    AFTERNOON = "AFTERNOON"
  }