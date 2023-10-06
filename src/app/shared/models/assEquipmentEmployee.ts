import { Employee } from "./Employee";
import { Equipment } from "./equipment";

export class assEquipmentEmployee{
   startDate?:Date;
   returnDate?:Date;
   equipmentStatus?:string;   
   employee?: Employee;
   equipment?:Equipment;
}