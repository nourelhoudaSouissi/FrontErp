import { Rapprochement } from "./rapprochement.model";

export interface Disbursement {
  [x: string]: any;
  id?: number;
  categoryDisbursement?: CategoryDisbursement;
  billId?: number;
  date?: string;
  description?: string;
  treasuryType?: TreasuryType;
  bankReconciliation?: Rapprochement;
}

export enum TreasuryType {
  En_COURS = 'En_COURS',
  SOLDÉ = 'SOLDÉ',
}

export enum CategoryDisbursement {
  FACTURE_FOURNISSEUR = 'FACTURE_FOURNISSEUR',
  AVOIR_CLIENT = 'AVOIR_CLIENT',
  PRÊT = 'PRÊT',
  VIREMENT_COMPTE_À_COMPTE = 'VIREMENT_COMPTE_À_COMPTE',
  AUTRES = 'AUTRES'
}

