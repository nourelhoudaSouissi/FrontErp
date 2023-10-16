import { workArrangement } from "./workArrangement"
import { extraDuty } from "./extraDuty"

export interface Benefit{
    id?: number
    titled?: string
    averageDailyCost?: number
    totalCost?: number
    cost?: number
    costEfficiency?: number
    exceptionalCosts?: boolean
    monthlyFees?: number
    extraDuties?: extraDuty[]
    workArrangements?: workArrangement[]
}

export enum BenefitStatus{
    SIGNED = "SIGNED",
    PROVISIONAL = "PROVISIONAL"
}