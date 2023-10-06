
export class RecoveryLeave  {
    id?: number;
    name?:string;
    date?: Date;
    comment?: string;
    duration?:number;
    numberHours?:number;
    recoveryType?:RecoveryType;
    recoveryDay?: RecoveryDay;
    inputDate?: string; 
    toTakeStartDate?:Date;
    toTakeEndDate?:Date;
    periodToTake?:number;
    holidayNum?:number;
    weekendDate?:Date;
    recoveryHours?:RecoveryHours;
    requestStatus?:RequestStatus;
    
}

export enum RecoveryType {
    DAYS="DAYS",
    MONEY="MONEY"
  }

  export enum RecoveryDay{
    HOLIDAY ="HOLIDAY", 
    WEEKEND="WEEKEND", 
    OVERTIME="OVERTIME"
  }

export enum RecoveryHours{
  HOLIDAY = "HOLIDAY",
  WEEKEND = "WEEKEND",
  NORMAL_DAYS = "NORMAL_DAYS"
  }

  export enum RequestStatus{
    VALIDATED = "VALIDATED",
    REJECTED = "REJECTED",
    PENDING = "PENDING"
    }