import type{ Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?:{
                id: string;
                role: "STUDENT" | "INSTRUCTOR"
            };
        }
    }
}
export const authMiddleware=(
    req: Request,
    res: Response ,
    next: NextFunction
)=> {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message: "missing token"});
    }
    try {
        const decoded = jwt.verify(token , "secret") as {
            id: string;
            role: "STUDENT" | "INSTRUCTOR"
        }

        req.user={ 
            id:decoded.id ,
            role:decoded.role
        };

        next();

    } catch(error){
        return res.status(401).json({
        message: "Invalid token"
    });
    }
}