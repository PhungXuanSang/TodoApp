import { IsIn } from "class-validator";

export class TodoDto {
    
    title : string;
    description : string;
     @IsIn(['pending', 'done'])
    status : "pending"|"done";
    dueDate : Date;
    isDeleted : boolean;
    userId : number;
}