export enum ReviewType{
  POSITIVE,
  NEUTRAL ,
  NEGATIVE ,
  CRITICAL ,
  VERIFIED,
  UNVERIFIED ,
  FEATURE_REQUEST ,
  BUG_REPORT,
  QUESTION ,
  COMPLIMENT 
}

export class clientReview {
    id?: number;
    dateReview?: string;
    subject?: string;
    comment?: string;
    satisfaction?: number;
    reviewtype?: ReviewType;
}