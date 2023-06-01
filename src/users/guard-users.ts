import { Socket } from "socket.io";
import { User } from "./entities/user.entity";
import { Gender } from "src/constant/constant";

export type AuthDto =  {
    
    userid: string;
  
    email: string;
  
    firstName: string;
  
    lastName: string;
  
    dob: string;
  
    gender: Gender;
  
    password: string;
  
    isActive: boolean;
  
    otp: string;
}

export type SocketWithAuth = Socket & AuthDto