import { AssQuestionInterview } from "./AssQuestionInterview";
import { UpdatedQuestion } from "./UpdatedQuestion";

export interface Interview{
    id ?:number;
    globalMark ?:number;
    interviewDate ?:string;
    interviewTime?:string;
    duration ?:string;
    comment ?:string;
    interviewlocation?:interviewLocation;
    interviewPlace?: string;
    interviewerName?:string;
    interviewerEmail?:string;
    interviewerPhoneNumber?:number;
    interviewType ?:InterviewType;
    interviewMode ?:InterviewMode;
    assQuestionInterview?: AssQuestionInterview[];
    updatedQuestions?: UpdatedQuestion[];
    coefficient?:number;
    interviewMark?:number;
}

export enum InterviewMode{
    REMOTE="REMOTE",
    ON_SITE="ON_SITE",
    PHONE_INTERVIEW="PHONE_INTERVIEW",
    VIDEOCONFERENCE="VIDEOCONFERENCE"
}

export enum InterviewType {
    TECHNICAL_INTERVIEW="TECHNICAL_INTERVIEW",
    HUMAN_RESOURCE_INTERVIEW="HUMAN_RESOURCE_INTERVIEW"
}

export enum interviewLocation{
    INTERNAL="INTERNAL" ,
     EXTERNAL="EXTERNAL"
}

export enum interviewStatus{
    PLANNED="PLANNED" ,
    ENDED="ENDED",
    CANCELLED="CANCELLED"
}
