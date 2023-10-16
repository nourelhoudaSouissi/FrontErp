import { Benefit } from "./Benefit"

export interface extraDuty{
    id?: number
    workingHoursNumber?: number
    hourWage?: number
    performanceBonus?: number
    extraDutyType?: ExtraDutyType
    benefit?: Benefit
}

export enum ExtraDutyType{
    OVERTIME = "OVERTIME", 
    ON_CALL_DUTY = "ON_CALL_DUTY", 
    HOLIDAY_DUTY = "HOLIDAY_DUTY", 
    EMERGENCY_DUTY = "EMERGENCY_DUTY", 
    STANDBY_DUTY = "STANDBY_DUTY", 
    TRAINING_DUTY = "TRAINING_DUTY"
}