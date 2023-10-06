import { Interview, InterviewType } from "./Interview";

export interface UpdatedQuestion{

    id ?:number;
    mark?: string;
    comment?: string;
    questionText?: string;
    interviewType?: InterviewType;
    interviewNum?: number;
}