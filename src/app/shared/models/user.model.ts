export interface User {
  id?:number;
  username?: string;
  image?: string;
  fullname?: string;
  adresse?: string;
  website?: string;
  phone?: number;
  email?:string;
  token?:string;
  roles?: string[];

}

export interface Role {
  id: number;
  name: string;
}

export enum ERole {
  ROLE_CUSTOMER = 'ROLE_CUSTOMER',
  ROLE_CUSTOMER_USER = 'ROLE_CUSTOMER_USER',
  ROLE_MODERATOR = 'ROLE_Moderator'
}
