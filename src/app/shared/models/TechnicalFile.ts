import { Employee } from './Employee';
import { Education } from './Education';
import { Certification } from './Certification';
import { Language } from './Language';
import { Experience } from './Experience';
import { Skills } from './Skills';

export interface TechnicalFile{
    id ?:number;
    reference?: string;
    description?: string;
    objective?: string;
    driverLicense?: string;
    experienceAmount?: number;
    skills?: Skills[];
    experiences?: Experience[];
    languages ?: Language[];
    certifications?: Certification[];
    education?: Education[];
    employeeId ?: number;
}

export enum Nationality{
    
}