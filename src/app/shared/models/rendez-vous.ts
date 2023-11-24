export interface RendezVous {
    id ?: number
    date ?: Date;
    time ?: string;
    duration ?:string;
    location ?:string;
    subject ?: string;
    contactNum :number ;
    contactFullName : string;
    contactId : number;
    noteBefore ?: string;
    noteAfter ?: string;
    appointmentType ?:AppointmentType;
    contactPhone ?: number;
    contactEmail ?: number;

}

export enum AppointmentType {
    VISIO_CONFERENCE = 'VISIO_CONFERENCE', 
    FACE_TO_FACE = 'FACE_TO_FACE', 
    PHONE_CALL = 'PHONE_CALL'
}
