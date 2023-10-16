import { contact } from "./contact";

export interface ContactNote {
    id ?: number ,
    subject ?: string ,
    note ?: string,
    contactNum: number,
    contact : contact
}