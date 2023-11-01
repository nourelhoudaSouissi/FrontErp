import { Rapprochement } from "./rapprochement.model";

export interface Tresorerie {
  [x: string]: any;
  id?: number;
  categoryCollection?: CategoryCollection;
  billClientId?:number ;
  date?: string;
  description?: string;
  treasuryType?: TreasuryType;
  bankReconciliation?: Rapprochement;
}

export enum TreasuryType {
  En_COURS = 'En_COURS',
  SOLDÉ = 'SOLDÉ',
}

export enum CategoryCollection {
  FACTURE_CLIENT = 'FACTURE_CLIENT',
  AVOIR_FOURNISSEUR = 'AVOIR_FOURNISSEUR',
  EMPREINT = 'EMPREINT',
  SUBVENTION = 'SUBVENTION',
  VIREMENT_COMPTE_À_COMPTE = 'VIREMENT_COMPTE_À_COMPTE',
  AUTRES = 'AUTRES'
}