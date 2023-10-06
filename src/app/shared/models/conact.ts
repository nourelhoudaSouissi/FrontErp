export interface conact {
    lastName: string,
    firstName:string,
    function:string,
    emailOne:string,
    emailTwo:string,
    comment:string,
    phoneNumberOne:number,
    phoneNumberTwo:number
    service : Service

}

export enum Service{


    RH ="RH",
     R_AND_D ="R_AND_D",
      FINANCE ="FINANCE",
       DEVELOPEMENT="DEVELOPEMENT"
}