import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: "teacher" | "student";
      };
    }
  }
}

export const verifyUser = async (req:Request, res:Response , next:NextFunction )=>{

    const token = req.headers.authorization;
     if(!token){
        return res.status(401).json(new ApiError("Unauthorized, token missing or invalid"))
     };

     try{
        const decodedToken = jwt.verify(token , "secret") as {
            id: string ;
            role: "student" | "teacher" 
        }

        req.user = {id: decodedToken.id , role:decodedToken.role} //for this we write declare global namespace thingy !!

      

        next();

     }catch(error){
        return res.status(401).json(new ApiError("Unauthorized, token missing or invalid"))
     }

}