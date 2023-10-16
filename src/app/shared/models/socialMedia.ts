import { Partner } from "./Partner";

export interface socialMedia {
    id ?: number 
    name ?: SocialMediaName 
    link ?: string 
    partnerNum ?: string
    partner ?: Partner } 

    export enum SocialMediaName {
        LINKEDIN = "LINKEDIN",
        INSTAGRAM = "INSTAGRAM" ,
        FACEBOOK = "FACEBOOK",
        WEB_SITE = "WEB_SITE"
    }

