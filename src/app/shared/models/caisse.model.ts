import { Rapprochement } from "./rapprochement.model";

export interface Caisse {
    id?: number;
    amount?: number;
    date?: string;
    description?: string;
    categoryCaisse?: CategoryCaisse;

  }
  
  export enum CategoryCaisse {
    ALIMENTATION_DE_CAISSE ='ALIMENTATION_DE_CAISSE',
    SORTIE_DE_CAISSE='SORTIE_DE_CAISSE'
  }
  

  