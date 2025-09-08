import { IsEmail, IsNotEmpty, Length, Min, MinLength } from "class-validator";
import { Not } from "typeorm";

export class LoginDto{
    @IsEmail()
    @IsNotEmpty()
    email : string;

    @IsNotEmpty()
    @MinLength(6)
    password : string;  

}