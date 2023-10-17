import { taskPhase } from "./Task";

export interface subTask{
 
    id: any;
   title: string;
   description : string;
   estimation : string;
   startDate : Date ;
   endDate : Date;
   taskPhase : taskPhase;
   
}