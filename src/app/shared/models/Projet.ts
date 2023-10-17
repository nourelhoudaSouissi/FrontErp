export interface Projet {
id ?: number ;
projectReference ?: string ;
name?: string ;
description?: number ;
budget?: string ;
startDate?: Date
endDate?: Date ;
type?: string
projectStatus?: ProjectStatus
projectType?: ProjectType
responsables?:any[]
}

export enum ProjectStatus{
    NOT_STARTED="NOT_STARTED" ,
    IN_PROGRESS= "IN_PROGRESS",
    ON_HOLD="ON_HOLD" ,
    COMPLETED="COMPLETED" ,
    
}
export enum ProjectType{
    INTERN="INTERN" ,
    EXTERN_FORFAIT="EXTERN FORFAIT",
    EXTERN_T_AND_M="EXTERN T_AND_M"

}
export enum Devise{
    DINAR="DT" ,
    EURO="EUR",
    DOLLAR="DLR"
}
export enum Fnction{
   
    SPONSOR="Sponsor du projet maitrise d'ouvrage",
    DIRECTEUR="Directeur",
    CHEF_OEUVRE="Chef du projet maitrise d'oeuvre",
    CHEF_OUVRAGE="Chef du projet maitrise d'ouvrage",
    CHEF_PRESTATAIRE="chef du projet chez le prestataire",
    RESPONSABLE_PRESTATAIRE="Responsable prestataire"
   
   

}